const express = require("express");
const {
  getOverviewAnalytics,
  getHotelAnalytics,
  getTourAnalytics,
  getPerformanceAnalytics,
  getAllBookings,
  getPeopleAnalytics,
} = require("../Controller/ownerAnalyticsController");
const { authenticateUser, authenticateRole } = require("../middleware/authentication");

const ownerRouter = express.Router();

// Apply authentication & owner role authorization middleware
ownerRouter.use(authenticateUser);
ownerRouter.use(authenticateRole(["owner"]));

// Endpoints
ownerRouter.get("/analytics/overview", getOverviewAnalytics);
ownerRouter.get("/analytics/hotels", getHotelAnalytics);
ownerRouter.get("/analytics/tours", getTourAnalytics);
ownerRouter.get("/analytics/performance", getPerformanceAnalytics);
ownerRouter.get("/analytics/bookings", getAllBookings);
ownerRouter.get("/analytics/people", getPeopleAnalytics);

module.exports = ownerRouter;