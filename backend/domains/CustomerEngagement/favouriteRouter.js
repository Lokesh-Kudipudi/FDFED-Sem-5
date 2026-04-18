const express = require("express");
const router = express.Router();
const {
  addFavourite,
  removeFavourite,
  getUserFavourites,
  checkFavourite,
} = require("./favouriteController");
const { authenticateUser } = require("../../middleware/authentication");

/**
 * @swagger
 * tags:
 *   name: Favourites
 *   description: User favourite tours management
 */

/**
 * @swagger
 * /api/favourites:
 *   post:
 *     summary: Add a tour to favourites
 *     tags: [Favourites]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourId
 *             properties:
 *               tourId:
 *                 type: string
 *                 description: The tour ID to favourite
 *     responses:
 *       200:
 *         description: Tour added to favourites
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateUser, addFavourite);

/**
 * @swagger
 * /api/favourites/{tourId}:
 *   delete:
 *     summary: Remove a tour from favourites
 *     tags: [Favourites]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tour ID to remove from favourites
 *     responses:
 *       200:
 *         description: Tour removed from favourites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Favourite not found
 */
router.delete("/:tourId", authenticateUser, removeFavourite);

/**
 * @swagger
 * /api/favourites:
 *   get:
 *     summary: Get all favourite tours for the logged-in user
 *     tags: [Favourites]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of favourite tours
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateUser, getUserFavourites);

/**
 * @swagger
 * /api/favourites/check/{tourId}:
 *   get:
 *     summary: Check if a tour is in favourites
 *     tags: [Favourites]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tour ID to check
 *     responses:
 *       200:
 *         description: Boolean indicating favourite status
 *       401:
 *         description: Unauthorized
 */
router.get("/check/:tourId", authenticateUser, checkFavourite);

module.exports = router;
