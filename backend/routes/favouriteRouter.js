const express = require("express");
const router = express.Router();
const {
  addFavourite,
  removeFavourite,
  getUserFavourites,
  checkFavourite,
} = require("../Controller/favouriteController");
const { authenticateUser } = require("../middleware/authentication");

// @route   POST /api/favourites
// @desc    Add tour to favourites
router.post("/", authenticateUser, addFavourite);

// @route   DELETE /api/favourites/:tourId
// @desc    Remove tour from favourites
router.delete("/:tourId", authenticateUser, removeFavourite);

// @route   GET /api/favourites
// @desc    Get user's favourites
router.get("/", authenticateUser, getUserFavourites);

// @route   GET /api/favourites/check/:tourId
// @desc    Check if tour is favourited
router.get("/check/:tourId", authenticateUser, checkFavourite);

module.exports = router;
