const express = require("express");
const router = express.Router();
const {
  getAllRequests,
  getMyQuotes,
  submitQuote,
  updateQuote,
} = require("../Controller/tourGuideCustomController");
const { authenticateUser, authenticateRole } = require("../middleware/authentication");

// All routes require authentication and tour guide role
router.use(authenticateUser);
router.use(authenticateRole(["tourGuide"]));

// @route   GET /api/tour-guide/custom-tours
router.get("/", getAllRequests);

// @route   GET /api/tour-guide/custom-tours/my-quotes
router.get("/my-quotes", getMyQuotes);

// @route   POST /api/tour-guide/custom-tours/:id/quote
router.post("/:id/quote", submitQuote);

// @route   PUT /api/tour-guide/custom-tours/:id/quote
router.put("/:id/quote", updateQuote);

module.exports = router;
