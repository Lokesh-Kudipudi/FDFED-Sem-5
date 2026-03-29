const express = require("express");
const reviewController = require("../Controller/reviewController");
const { authenticateUser } = require("../middleware/authentication");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management endpoints
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: Rating from 1 to 5
 *               review:
 *                 type: string
 *                 description: Text content of the review
 *               tour:
 *                 type: string
 *                 description: ID of the tour being reviewed
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Bad request (missing fields)
 *       401:
 *         description: Unauthorized
 */
const router = express.Router();

router.post("/", authenticateUser, reviewController.createReview);

module.exports = router;
