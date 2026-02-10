const express = require("express");
const { authenticateUser, authenticateRole } = require("../middleware/authentication");
const {
  getAdminHomepageAnalytics,
  getAdminPackagesAnalytics,
  getAdminHotelAnalytics,
} = require("../Controller/analyticsController");
const {
  getAllQueries,
  deleteQuery,
  replyToQuery,
} = require("../Controller/ContactController");
const {
  getAllBookingsAdmin,
  cancelBookingAdmin,
} = require("../Controller/bookingController");
const {
  getAllTourGuides,
  createUser,
  deleteUser,
  getAllHotelManagers,
} = require("../Controller/adminUserController");
const {
  getAllRequests,
  assignTourGuide,
} = require("../Controller/adminCustomTourController");
const { User } = require("../Model/userModel");
const { Booking } = require("../Model/bookingModel");
const { Hotel } = require("../Model/hotelModel");
const { Tour } = require("../Model/tourModel");

const adminRouter = express.Router();

// Apply authentication and admin role to all routes
adminRouter.use(authenticateUser);
adminRouter.use(authenticateRole(["admin"]));

// Dashboard analytics
adminRouter.get("/dashboard", async (req, res) => {
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

// Customer management
adminRouter.get("/customers", async (req, res) => {
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

// Query management
adminRouter.get("/queries", getAllQueries);
adminRouter.delete("/queries/:id", deleteQuery);
adminRouter.post("/queries/:id/reply", replyToQuery);

// Hotel analytics
adminRouter.get("/hotels/analytics", async (req, res) => {
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

// Update hotel commission
adminRouter.put("/hotels/:id/commission", async (req, res) => {
  try {
    const { id } = req.params;
    const { commissionRate } = req.body;

    const hotel = await Hotel.findByIdAndUpdate(
      id,
      { commissionRate },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ status: "error", message: "Hotel not found" });
    }

    res.status(200).json({ status: "success", data: hotel });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Tour/package analytics
adminRouter.get("/tours/analytics", async (req, res) => {
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

// Update tour commission
adminRouter.put("/tours/:id/commission", async (req, res) => {
  try {
    const { id } = req.params;
    const { commissionRate } = req.body;

    const tour = await Tour.findByIdAndUpdate(
      id,
      { commissionRate },
      { new: true }
    );

    if (!tour) {
      return res.status(404).json({ status: "error", message: "Tour not found" });
    }

    res.status(200).json({ status: "success", data: tour });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Booking management
adminRouter.get("/bookings", async (req, res) => {
  const result = await getAllBookingsAdmin();
  if (result.status === "success") {
    return res.status(200).json(result);
  }
  return res.status(500).json(result);
});

adminRouter.post("/bookings/:bookingId/cancel", async (req, res) => {
  const result = await cancelBookingAdmin(req.params.bookingId);
  if (result.status === "success") {
    return res.status(200).json(result);
  }
  return res.status(400).json(result);
});

// User management
adminRouter.get("/tour-guides", getAllTourGuides);
adminRouter.post("/users", createUser);
adminRouter.delete("/users/:userId", deleteUser);

// Custom tour management
adminRouter.get("/custom-tours", getAllRequests);
adminRouter.post("/custom-tours/:id/assign", assignTourGuide);

adminRouter.get("/hotel-managers", getAllHotelManagers);

module.exports = adminRouter;
