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

/**
 * @swagger
 * tags:
 *   name: Owner Analytics
 *   description: Endpoints for platform owner analytics
 */

/**
 * @swagger
 * /api/owner/analytics/overview:
 *   get:
 *     summary: Get overview analytics
 *     tags: [Owner Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not an owner)
 * 
 * /api/owner/analytics/hotels:
 *   get:
 *     summary: Get hotel analytics
 *     tags: [Owner Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hotel analytics retrieved successfully
 * 
 * /api/owner/analytics/tours:
 *   get:
 *     summary: Get tour analytics
 *     tags: [Owner Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tour analytics retrieved successfully
 * 
 * /api/owner/analytics/performance:
 *   get:
 *     summary: Get platform performance analytics
 *     tags: [Owner Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance analytics retrieved successfully
 * 
 * /api/owner/analytics/bookings:
 *   get:
 *     summary: Get all bookings analytics
 *     tags: [Owner Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings retrieved successfully
 * 
 * /api/owner/analytics/people:
 *   get:
 *     summary: Get people analytics
 *     tags: [Owner Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: People analytics retrieved successfully
 */
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