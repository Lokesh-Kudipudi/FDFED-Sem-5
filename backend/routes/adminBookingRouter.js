const express = require("express");
const {
  getAllBookingsAdmin,
  getBookingDetailsAdmin,
  cancelBookingAdmin,
} = require("../Controller/bookingController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

// All routes require authentication and admin role
router.get("/", authenticateUser, async (req, res) => {
  const result = await getAllBookingsAdmin();
  if (result.status === "success") {
    return res.status(200).json(result);
  }
  return res.status(500).json(result);
});

router.get("/:bookingId", authenticateUser, async (req, res) => {
  const result = await getBookingDetailsAdmin(req.params.bookingId);
  if (result.status === "success") {
    return res.status(200).json(result);
  }
  return res.status(result.message === "Booking not found" ? 404 : 500).json(result);
});

router.post("/:bookingId/cancel", authenticateUser, async (req, res) => {
  const result = await cancelBookingAdmin(req.params.bookingId);
  if (result.status === "success") {
    return res.status(200).json(result);
  }
  return res.status(400).json(result);
});

module.exports = router;
