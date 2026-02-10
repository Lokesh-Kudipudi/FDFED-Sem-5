const express = require("express");
const { updateUser } = require("../Controller/userController");
const {
  getUserBookings,
  getHotelBookings,
  cancelBooking,
  getTourGuideBookings,
  updateBookingStatus,
} = require("../Controller/bookingController");
const { getHotelIdsByOwnerId } = require("../Controller/ownerController");
const {
  getAdminHomepageAnalytics,
  getAdminPackagesAnalytics,
  getHotelMangerHomePageAnalytics,
  getAdminHotelAnalytics,
  getTourGuideAnalytics,
} = require("../Controller/analyticsController");
const { authenticateRole } = require("../middleware/authentication");
const { getToursByGuide } = require("../Controller/tourController");
const {
  getHotelById,
  updateHotel,
  deleteHotel,
} = require("../Controller/hotelController");

const {
  getAllQueries,
  deleteQuery,
  replyToQuery,
  getUserQueries,
} = require("../Controller/ContactController");
const { User } = require("../Model/userModel");
const { Booking } = require("../Model/bookingModel");
const { Hotel } = require("../Model/hotelModel");
const { Tour } = require("../Model/tourModel");
const upload = require("../middleware/upload");

const dashboardRouter = express.Router();

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

// Settings POST only (for profile update)
dashboardRouter.route("/settings").post(
  (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
      if (err) {
        console.error("UPLOAD ERROR:", JSON.stringify(err, null, 2));
        console.error("UPLOAD ERROR MESSAGE:", err.message);
        return res.status(500).json({
          status: "fail",
          message: "Image upload failed",
          error: err.message || err,
        });
      }
      next();
    });
  },
  updateUser
);

// Photo Upload Endpoint for navbar profile
dashboardRouter.route("/upload-photo").post(
  (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
      if (err) {
        console.error("UPLOAD ERROR:", JSON.stringify(err, null, 2));
        return res.status(500).json({
          status: "fail",
          message: "Image upload failed",
          error: err.message || err,
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "fail",
          message: "No file uploaded",
        });
      }

      const photoUrl = req.file.path;

      // Update user in database
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { photo: photoUrl },
        { new: true }
      );

      res.status(200).json({
        status: "success",
        message: "Photo uploaded successfully",
        photoUrl: photoUrl,
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }
);

// ADMIN Dashboard API
dashboardRouter
  .route("/api/admin-dashboard")
  .get(authenticateRole(["admin"]), async (req, res) => {
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

// ADMIN Customers API
dashboardRouter
  .route("/api/admin/customers")
  .get(authenticateRole(["admin"]), async (req, res) => {
    try {
      const customers = await User.find({ role: "user" })
        .select("-passwordHash")
        .lean();

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
            status: "Active",
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

// Update Hotel Commission
dashboardRouter
  .route("/api/admin/hotels/:id/commission")
  .put(authenticateRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const { commissionRate } = req.body;

      const hotel = await Hotel.findByIdAndUpdate(
        id,
        { commissionRate },
        { new: true }
      );

      if (!hotel) {
        return res
          .status(404)
          .json({ status: "error", message: "Hotel not found" });
      }

      res.status(200).json({ status: "success", data: hotel });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

// ADMIN Packages API
dashboardRouter
  .route("/api/admin/packages-analytics")
  .get(authenticateRole(["admin"]), async (req, res) => {
    try {
      const packageAnalytics = await getAdminPackagesAnalytics();

      if (packageAnalytics.status === "error") {
        return res.status(500).json(packageAnalytics);
      }
      res.status(200).json(packageAnalytics);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

// Update Tour Commission
dashboardRouter
  .route("/api/admin/tours/:id/commission")
  .put(authenticateRole(["admin"]), async (req, res) => {
    try {
      const { id } = req.params;
      const { commissionRate } = req.body;

      const tour = await Tour.findByIdAndUpdate(
        id,
        { commissionRate },
        { new: true }
      );

      if (!tour) {
        return res
          .status(404)
          .json({ status: "error", message: "Tour not found" });
      }

      res.status(200).json({ status: "success", data: tour });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

// Hotel Manager Dashboard Stats API
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

// Hotel Manager Bookings API
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

// API route to update/delete hotel
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

// Cancel booking
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

// ADMIN: Reply to Query
dashboardRouter
  .route("/api/admin/queries/:id/reply")
  .post(authenticateRole(["admin"]), replyToQuery);

// USER: Get My Queries (Inbox)
dashboardRouter.route("/api/user/queries").get(getUserQueries);

// Update booking status
dashboardRouter
  .route("/api/bookings/:bookingId/status")
  .post(async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      const result = await updateBookingStatus(bookingId, status);

      if (result.status === "success") {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

module.exports = dashboardRouter;
