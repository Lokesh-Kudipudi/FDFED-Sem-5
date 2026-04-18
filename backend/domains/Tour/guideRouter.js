const express = require("express");
const { authenticateUser, authenticateRole } = require("../../middleware/authentication");
const { getTourGuideAnalytics } = require("../AdminAndCore/analyticsController");
const { getTourGuideBookings } = require("../Booking/bookingController");
const { getToursByGuide } = require("./tourController");
const { getAllRequests, submitQuote, updateQuote } = require("./tourGuideCustomController");

const guideRouter = express.Router();

// Apply authentication and role check
guideRouter.use(authenticateUser);
guideRouter.use(authenticateRole(["tourGuide"]));

/**
 * @swagger
 * tags:
 *   name: Guide
 *   description: Tour guide dashboard and management
 */

/**
 * @swagger
 * /api/guide/stats:
 *   get:
 *     summary: Get tour guide dashboard statistics
 *     tags: [Guide]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Guide analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *       500:
 *         description: Server error
 */
guideRouter.get("/stats", async (req, res) => {
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

/**
 * @swagger
 * /api/guide/tours:
 *   get:
 *     summary: Get tours assigned to the guide
 *     tags: [Guide]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of tours managed by the guide
 *       500:
 *         description: Server error
 */
guideRouter.get("/tours", async (req, res) => {
  try {
    const tours = await getToursByGuide(req.user._id);
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

/**
 * @swagger
 * /api/guide/bookings:
 *   get:
 *     summary: Get bookings for the guide's tours
 *     tags: [Guide]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *       500:
 *         description: Server error
 */
guideRouter.get("/bookings", async (req, res) => {
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

/**
 * @swagger
 * /api/guide/custom-tours:
 *   get:
 *     summary: Get custom tour requests assigned to the guide
 *     tags: [Guide]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of custom tour requests
 *       500:
 *         description: Server error
 */
guideRouter.get("/custom-tours", getAllRequests);

/**
 * @swagger
 * /api/guide/custom-tours/{id}/quote:
 *   post:
 *     summary: Submit a quote for a custom tour request
 *     tags: [Guide]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom tour request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 55000
 *               message:
 *                 type: string
 *                 example: "Great trip planned for you!"
 *               itinerary:
 *                 type: string
 *                 example: "Day 1: Arrival. Day 2: Sightseeing..."
 *     responses:
 *       200:
 *         description: Quote submitted
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
guideRouter.post("/custom-tours/:id/quote", submitQuote);

/**
 * @swagger
 * /api/guide/custom-tours/{id}/quote:
 *   put:
 *     summary: Update an existing quote for a custom tour request
 *     tags: [Guide]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom tour request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               message:
 *                 type: string
 *               itinerary:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quote updated
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
guideRouter.put("/custom-tours/:id/quote", updateQuote);

module.exports = guideRouter;
