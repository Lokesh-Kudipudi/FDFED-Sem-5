const express = require("express");
const router = express.Router();
const { getAllRequests, submitQuote } = require("../Controller/tourGuideCustomController");
const { authenticateUser, authenticateRole } = require("../middleware/authentication");

// All routes require authentication and tour guide role
router.use(authenticateUser);
router.use(authenticateRole(["tourGuide"]));

// @route   GET /api/tour-guide/custom-tours
router.get("/", getAllRequests);

// @route   POST /api/tour-guide/custom-tours/:id/quote
router.post("/:id/quote", submitQuote);

module.exports = router;
