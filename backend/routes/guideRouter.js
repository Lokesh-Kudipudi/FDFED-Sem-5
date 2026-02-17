const express = require("express");
const { authenticateUser, authenticateRole } = require("../middleware/authentication");
const { getTourGuideAnalytics } = require("../Controller/analyticsController");
const { getTourGuideBookings } = require("../Controller/bookingController");
const { getToursByGuide } = require("../Controller/tourController");
const { getAllRequests, submitQuote, updateQuote } = require("../Controller/tourGuideCustomController");

const guideRouter = express.Router();

// Apply authentication and role check
guideRouter.use(authenticateUser);
guideRouter.use(authenticateRole(["tourGuide"]));

// Dashboard stats
guideRouter.get("/stats", async (req, res) => {
  try {
    const analytics = await getTourGuideAnalytics(req.user._id);
    if (analytics.status === "error") {
      return res.status(500).json(analytics);
    }
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Get guide's tours
guideRouter.get("/tours", async (req, res) => {
  try {
    const tours = await getToursByGuide(req.user._id);
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Get guide's bookings
guideRouter.get("/bookings", async (req, res) => {
  try {
    const bookings = await getTourGuideBookings(req.user._id);
    if (bookings.status === "error") {
      return res.status(500).json(bookings);
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Custom tours assigned to guide
guideRouter.get("/custom-tours", getAllRequests);
guideRouter.post("/custom-tours/:id/quote", submitQuote);
guideRouter.put("/custom-tours/:id/quote", updateQuote);

module.exports = guideRouter;
