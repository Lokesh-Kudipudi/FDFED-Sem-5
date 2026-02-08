const express = require("express");
const router = express.Router();
const {
  createRequest,
  getUserRequests,
  submitBargain,
  acceptQuote,
} = require("../Controller/customTourController");
const { authenticateUser } = require("../middleware/authentication");

// All routes require authentication
router.use(authenticateUser);

// @route   POST /api/custom-tours
router.post("/", createRequest);

// @route   GET /api/custom-tours
router.get("/", getUserRequests);

// @route   POST /api/custom-tours/:id/bargain
router.post("/:id/bargain", submitBargain);

// @route   POST /api/custom-tours/:id/accept
router.post("/:id/accept", acceptQuote);

module.exports = router;
