const express = require("express");
const reviewController = require("../Controller/reviewController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/", authenticateUser, reviewController.createReview);
router.get("/:itemId", reviewController.getReviewsByItem);

module.exports = router;
