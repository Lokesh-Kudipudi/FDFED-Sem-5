const express = require("express");
const {
  updateUser,
  getUserBookingsController,
  getBookingAnalyticsController,
  getHotelBookingsController,
  getTourBookingsController,
} = require("../Controller/userController");
const {
  getUserBookings,
  getHotelBookings,
  cancelBooking,
  getTourGuideBookings,
} = require("../Controller/bookingController");
const {
  getHotelIdsByOwnerId,
  addHotelIdToOwner,
} = require("../Controller/ownerController");
const {
  getUserAnalytics,
  getAdminHomepageAnalytics,
  getAdminPackagesAnalytics,
  getHotelMangerHomePageAnalytics,
  getAdminHotelAnalytics,
  getTourGuideAnalytics,
} = require("../Controller/analyticsController");
const { authenticateRole } = require("../middleware/authentication");
const { getTourById, getToursByGuide } = require("../Controller/tourController");
const {
  getAllHotels,
  getHotelById,
  updateHotel,
  addRoomType,
  updateRoomType,
  getRoomTypesByHotelId,
  deleteHotel,
} = require("../Controller/hotelController");
const { Types } = require("mongoose");

const {
  getAllQueries,
  deleteQuery,
  replyToQuery,
  getUserQueries,
} = require("../Controller/ContactController");
const { User } = require("../Model/userModel");
const { Booking } = require("../Model/bookingModel");
const upload = require("../middleware/upload");

const dashboardRouter = express.Router();


// USER Dashboard Routes

dashboardRouter
  .route("/")
  .get(
    authenticateRole(["user", "admin", "hotelManager"]),
    async (req, res) => {
      const userAnalytics = await getUserAnalytics(req.user._id);

      console.log(userAnalytics);
      // Send User Dashboard

      res.render("dashboard/user/index", {
        user: req.user,
        userAnalytics,
      });
    }
  );



// API endpoint to get user bookings as JSON
dashboardRouter
  .route("/api/bookings")
  .get(
    authenticateRole(["user", "admin", "hotelManager", "tourGuide"]),
    async (req, res) => {
      try {
        const bookings = await getUserBookings(req.user._id);

        if (bookings.status === "error") {
          return res.status(500).json({
            status: "error",
            message: bookings.message,
          });
        }

        res.status(200).json({
          status: "success",
          data: bookings.data,
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
    }
  );

dashboardRouter
  .route("/myTrips")
  .get(
    authenticateRole(["user", "admin", "hotelManager"]),
    getUserBookingsController
  );

// Booking Analytics Route
dashboardRouter
  .route("/bookings/analytics")
  .get(
    authenticateRole(["user", "admin", "hotelManager"]),
    getBookingAnalyticsController
  );

// Hotel Bookings Route
dashboardRouter
  .route("/bookings/hotels")
  .get(
    authenticateRole(["user", "admin", "hotelManager"]),
    getHotelBookingsController
  );

// Tour Bookings Route
dashboardRouter
  .route("/bookings/tours")
  .get(
    authenticateRole(["user", "admin", "hotelManager"]),
    getTourBookingsController
  );

dashboardRouter
  .route("/settings")
  .get(authenticateRole(["user", "admin", "hotelManager"]), (req, res) => {
    // Send User Dashboard

    res.render("dashboard/user/settings", { user: req.user });
  })
  .post((req, res, next) => {
    upload.single("photo")(req, res, (err) => {
      if (err) {
        console.error("UPLOAD ERROR:", JSON.stringify(err, null, 2));
        console.error("UPLOAD ERROR MESSAGE:", err.message);
        return res.status(500).json({ 
          status: "fail", 
          message: "Image upload failed", 
          error: err.message || err 
        });
      }
      next();
    });
  }, updateUser);

// ADMIN Dashboard API
dashboardRouter.route("/api/admin-dashboard").get(authenticateRole(["admin"]), async (req, res) => {
  try {
    const analytics = await getAdminHomepageAnalytics();
    if (analytics.status === "error") {
      return res.status(500).json(analytics);
    }
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

dashboardRouter
  .route("/api/admin/queries")
  .get(authenticateRole(["admin"]), getAllQueries);

dashboardRouter
  .route("/api/admin/queries/:id")
  .delete(authenticateRole(["admin"]), deleteQuery);

// ADMIN Dashboard

dashboardRouter
  .route("/admin")
  .get(authenticateRole(["admin"]), async (req, res) => {
    // Send Admin Dashboard

    const adminAnalytics = await getAdminHomepageAnalytics();

    res.render("dashboard/admin/index", {
      adminAnalytics,
    });
  });

dashboardRouter
  .route("/admin/analytics")
  .get(authenticateRole(["admin"]), (req, res) => {
    // Send Admin Dashboard
    res.render("dashboard/admin/analytics");
  });

// ADMIN Customers API
dashboardRouter
  .route("/api/admin/customers")
  .get(authenticateRole(["admin"]), async (req, res) => {
    try {
      const customers = await User.find({ role: "user" })
        .select("-passwordHash")
        .lean();

      // We need to calculate stats for each customer (bookings, spent, etc.)
      // This might be expensive if there are many customers.
      // Ideally, we should use aggregation or store stats on the user model.
      // For now, let's do a simple aggregation.

      const customersWithStats = await Promise.all(
        customers.map(async (customer) => {
          const bookings = await Booking.find({ userId: customer._id }).lean();
          const totalBookings = bookings.length;
          const totalSpent = bookings.reduce(
            (acc, b) => acc + (b.bookingDetails?.price || 0),
            0
          );
          const lastBooking = bookings.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0];

          return {
            ...customer,
            bookings: totalBookings,
            spent: totalSpent,
            lastTravel: lastBooking
              ? new Date(lastBooking.createdAt).toLocaleDateString()
              : "N/A",
            status: "Active", // Placeholder, maybe check last login or booking
            membership:
              totalSpent > 10000
                ? "Platinum"
                : totalSpent > 5000
                ? "Gold"
                : "Silver",
          };
        })
      );

      res.status(200).json({
        status: "success",
        data: customersWithStats,
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

dashboardRouter
  .route("/admin/customers")
  .get(authenticateRole(["admin"]), (req, res) => {
    // Send Admin Dashboard
    res.render("dashboard/admin/customers");
  });

// ADMIN Hotel Analytics API
dashboardRouter
  .route("/api/admin/hotel-analytics")
  .get(authenticateRole(["admin"]), async (req, res) => {
    try {
      const analytics = await getAdminHotelAnalytics();
      if (analytics.status === "error") {
        return res.status(500).json(analytics);
      }
      res.status(200).json(analytics);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

dashboardRouter
  .route("/admin/hotelManagement")
  .get(authenticateRole(["admin"]), async (req, res) => {
    const hotels = await getAllHotels();

    // Send Admin Dashboard
    res.render("dashboard/admin/hotelManagement", {
      hotels: hotels.data,
    });
  });

// ADMIN Packages API
dashboardRouter
  .route("/api/admin/packages-analytics")
  .get(authenticateRole(["admin"]), async (req, res) => {
    try {
      const packageAnalytics = await getAdminPackagesAnalytics();
      // Convert ObjectId to string if needed, though JSON handles it usually.
      // But let's keep consistency with the render route logic if there was any specific reason.
      // The render route did: bkg._id = bkg._id.toString();
      // We can do it here too if needed, but usually res.json handles it.

      if (packageAnalytics.status === "error") {
        return res.status(500).json(packageAnalytics);
      }
      res.status(200).json(packageAnalytics);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

dashboardRouter
  .route("/admin/packages")
  .get(authenticateRole(["admin"]), async (req, res) => {
    const packageAnalytics = await getAdminPackagesAnalytics();
    packageAnalytics.bookingAnalytics.forEach((bkg) => {
      bkg._id = bkg._id.toString();
    });

    // Send Admin Dashboard
    res.render("dashboard/admin/packages", { packageAnalytics });
  });

dashboardRouter
  .route("/admin/packages/add")
  .get(authenticateRole(["admin"]), async (req, res) => {
    // Send Admin Dashboard
    res.render("dashboard/admin/addPackage");
  });

dashboardRouter
  .route("/admin/packages/:id")
  .get(authenticateRole(["admin"]), async (req, res) => {
    const packageId = req.params.id;
    const Tour = await getTourById(packageId);

    // Send Admin Dashboard
    res.render("dashboard/admin/package", { tour: Tour.data });
  });

dashboardRouter
  .route("/hotelManager")
  .get(authenticateRole(["hotelManager"]), async (req, res) => {
    const hotelId = await getHotelIdsByOwnerId(req.user._id);
    const hotelManagerAnalytics = await getHotelMangerHomePageAnalytics(
      hotelId
    );

    // Send Hotel Manager Dashboard
    res.render("dashboard/hotelManager/index", {
      hotelManagerAnalytics,
      user: req.user,
    });
  });

dashboardRouter
  .route("/api/hotelManager/dashboard-stats")
  .get(async (req, res) => {
    try {
      const hotelId = await getHotelIdsByOwnerId(req.user._id);
      if (!hotelId) {
        return res.status(404).json({
          status: "error",
          message: "No hotel found for this owner",
        });
      }
      const analytics = await getHotelMangerHomePageAnalytics(hotelId);

      if (analytics.status === "error") {
        return res.status(500).json(analytics);
      }

      res.status(200).json(analytics);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

// Add a new room type
dashboardRouter.post("/api/rooms", async (req, res) => {
  const { title, price, rating, image, features } = req.body;
  const newRoom = {
    title,
    price,
    rating,
    image,
    features,
    _id: new Types.ObjectId(),
  };
  const hotelId = await getHotelIdsByOwnerId(req.user._id);
  const newRoomObject = await addRoomType(hotelId, newRoom);
  res.status(201).json({
    message: "Room added successfully",
    room: newRoomObject,
  });
});

// Edit an existing room type
dashboardRouter.put("/api/rooms/:roomTypeId", async (req, res) => {
  console.log(req.path);
  const { roomTypeId } = req.params;
  const { title, price, rating, image, features } = req.body;
  const updatedRoom = {
    title,
    price,
    rating,
    image,
    features,
  };

  const hotelId = await getHotelIdsByOwnerId(req.user._id);

  const updatedRoomObject = await updateRoomType(
    hotelId,
    roomTypeId,
    updatedRoom
  );

  res.status(200).json({
    message: "Room updated successfully",
    room: updatedRoomObject,
  });
});

dashboardRouter
  .route("/api/hotelManager/booking")
  .get(authenticateRole(["hotelManager"]), async (req, res) => {
    try {
      const hotelId = await getHotelIdsByOwnerId(req.user._id);

      if (!hotelId) {
        return res
          .status(404)
          .json({ message: "No hotel found for this manager" });
      }

      const bookings = await getHotelBookings(hotelId);

      if (bookings.status === "success") {
        res.status(200).json({
          message: "Bookings fetched.",
          bookings: bookings.data,
        });
      } else {
        res
          .status(404)
          .json({ message: bookings.message || "No bookings found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

dashboardRouter
  .route("/hotelManager/booking")
  .get(authenticateRole(["hotelManager"]), (req, res) => {
    // Send Hotel Manager Dashboard
    res.render("dashboard/hotelManager/booking", {
      user: req.user,
    });
  });

dashboardRouter
  .route("/api/hotelManager/owner")
  .get(authenticateRole(["hotelManager"]), async (req, res) => {
    if (!req.user || req.user.role !== "hotelManager") {
      return res.status(401).json({ message: "Unauthorizrsed" });
    }

    const hotelIds = await getHotelIdsByOwnerId(req.user._id);
    if (hotelIds) {
      res.status(200).json({
        message: "Hotel IDs fetched successfully",
        hotelIds,
      });
    } else {
      res.status(404).json({ message: "No hotels found" });
    }
  })
  .post(async (req, res) => {
    const { hotelId } = req.body;
    const ownerId = req.user._id;

    if (!hotelId) {
      return res.status(400).json({ message: "Hotel ID is required" });
    }

    const newOwner = await addHotelIdToOwner(ownerId, hotelId);

    if (newOwner) {
      res.status(201).json({
        message: "Hotel ID added successfully",
        newOwner,
      });
    } else {
      res.status(500).json({
        message: "Failed to add hotel ID",
      });
    }
  });

dashboardRouter
  .route("/hotelManager/rooms")
  .get(authenticateRole(["hotelManager"]), (req, res) => {
    // Send Hotel Manager Dashboard
    res.render("dashboard/hotelManager/roomsIndex");
  });

dashboardRouter.route("/hotelManager/addRoom");
dashboardRouter
  .route("/hotelManager/addRoom")
  .get(authenticateRole(["hotelManager"]), async (req, res) => {
    const hotelId = await getHotelIdsByOwnerId(req.user._id);
    const roomTypes = await getRoomTypesByHotelId(hotelId);

    // Send Hotel Manager Dashboard
    res.render("dashboard/hotelManager/roomsAdd", {
      roomTypes: roomTypes.data,
      user: req.user,
    });
  });

// My Hotel page route
dashboardRouter
  .route("/api/hotelManager/myHotel")
  .get(authenticateRole(["hotelManager"]), async (req, res) => {
    try {
      const hotelId = await getHotelIdsByOwnerId(req.user._id);
      if (!hotelId) {
        return res.status(404).json({ message: "No hotel found" });
      }
      const hotelData = await getHotelById(hotelId);

      if (hotelData.status === "success") {
        res.status(200).json(hotelData);
      } else {
        res.status(404).json({ message: "Hotel data not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotel details" });
    }
  });

// API route to update hotel
dashboardRouter
  .route("/api/hotel")
  .put(authenticateRole(["hotelManager"]), async (req, res) => {
    try {
      const hotelId = await getHotelIdsByOwnerId(req.user._id);
      const result = await updateHotel(hotelId, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  })
  .delete(authenticateRole(["hotelManager"]), async (req, res) => {
    try {
      const hotelId = await getHotelIdsByOwnerId(req.user._id);
      const result = await deleteHotel(hotelId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  });

dashboardRouter
  .route("/api/bookings/cancel/:bookingId")
  .post(async (req, res) => {
    try {
      const { bookingId } = req.params;
      const result = await cancelBooking(bookingId);

      if (result.status === "success") {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

// Tour Guide Routes
dashboardRouter
  .route("/api/tourGuide/dashboard-stats")
  .get(authenticateRole(["tourGuide"]), async (req, res) => {
    try {
      const analytics = await getTourGuideAnalytics(req.user._id);
      if (analytics.status === "error") {
        return res.status(500).json(analytics);
      }
      res.status(200).json(analytics);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

dashboardRouter
  .route("/api/tourGuide/myTours")
  .get(authenticateRole(["tourGuide"]), async (req, res) => {
    try {
      const tours = await getToursByGuide(req.user._id);
      res.status(200).json(tours);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

dashboardRouter
  .route("/api/tourGuide/bookings")
  .get(authenticateRole(["tourGuide"]), async (req, res) => {
    try {
      const bookings = await getTourGuideBookings(req.user._id);
      if (bookings.status === "error") {
        return res.status(500).json(bookings);
      }
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });



// ... existing routes ...

// ADMIN: Reply to Query
dashboardRouter
  .route("/api/admin/queries/:id/reply")
  .post(authenticateRole(["admin"]), replyToQuery);

// USER: Get My Queries (Inbox)
dashboardRouter.route("/api/user/queries").get(getUserQueries);

module.exports = dashboardRouter;
