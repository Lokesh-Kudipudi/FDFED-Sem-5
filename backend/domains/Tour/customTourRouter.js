const express = require("express");
const router = express.Router();
const {
  createRequest,
  getUserRequests,
  submitBargain,
  acceptQuote,
} = require("./customTourController");
const { authenticateUser } = require("../../middleware/authentication");

// All routes require authentication
router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Custom Tours
 *   description: Custom tour request management
 */

/**
 * @swagger
 * /api/custom-tours:
 *   post:
 *     summary: Create a custom tour request
 *     tags: [Custom Tours]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - places
 *               - budget
 *               - travelDates
 *               - numPeople
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Goa Adventure Trip"
 *               places:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Goa", "Mumbai"]
 *               hotelRequirements:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [budget, mid-range, luxury]
 *                   preferences:
 *                     type: string
 *               additionalRequirements:
 *                 type: string
 *               budget:
 *                 type: number
 *                 example: 50000
 *               travelDates:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *               numPeople:
 *                 type: integer
 *                 minimum: 1
 *                 example: 4
 *     responses:
 *       200:
 *         description: Custom tour request created
 *       401:
 *         description: Unauthorized
 */
router.post("/", createRequest);

/**
 * @swagger
 * /api/custom-tours:
 *   get:
 *     summary: Get all custom tour requests for the logged-in user
 *     tags: [Custom Tours]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of custom tour requests
 *       401:
 *         description: Unauthorized
 */
router.get("/", getUserRequests);

/**
 * @swagger
 * /api/custom-tours/{id}/bargain:
 *   post:
 *     summary: Submit a bargain on a custom tour request
 *     tags: [Custom Tours]
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
 *                 example: 45000
 *               message:
 *                 type: string
 *                 example: "Can we do it for less?"
 *     responses:
 *       200:
 *         description: Bargain submitted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.post("/:id/bargain", submitBargain);

/**
 * @swagger
 * /api/custom-tours/{id}/accept:
 *   post:
 *     summary: Accept a quote on a custom tour request
 *     tags: [Custom Tours]
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quoteId:
 *                 type: string
 *                 description: ID of the quote to accept
 *     responses:
 *       200:
 *         description: Quote accepted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.post("/:id/accept", acceptQuote);

module.exports = router;
