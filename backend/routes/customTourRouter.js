const express = require("express");
const router = express.Router();
const {
  createRequest,
  getUserRequests,
  getRequestById,
  submitBargain,
  acceptQuote,
  rejectRequest,
  cancelRequest,
} = require("../Controller/customTourController");
const { authenticateUser } = require("../middleware/authentication");

// All routes require authentication
router.use(authenticateUser);

// @route   POST /api/custom-tours
router.post("/", createRequest);

// @route   GET /api/custom-tours
router.get("/", getUserRequests);

// @route   GET /api/custom-tours/:id
router.get("/:id", getRequestById);

// @route   POST /api/custom-tours/:id/bargain
router.post("/:id/bargain", submitBargain);

// @route   POST /api/custom-tours/:id/accept
router.post("/:id/accept", acceptQuote);

// @route   POST /api/custom-tours/:id/reject
router.post("/:id/reject", rejectRequest);

// @route   DELETE /api/custom-tours/:id
router.delete("/:id", cancelRequest);

module.exports = router;
