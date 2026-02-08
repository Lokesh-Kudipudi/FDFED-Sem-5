const express = require("express");
const { authenticateUser, authenticateRole } = require("../middleware/authentication");
const { getHotelMangerHomePageAnalytics } = require("../Controller/analyticsController");
const { getHotelBookings } = require("../Controller/bookingController");
const { getHotelIdsByOwnerId } = require("../Controller/ownerController");
const { getHotelById, updateHotel, deleteHotel } = require("../Controller/hotelController");

const managerRouter = express.Router();

// Apply authentication and role check
managerRouter.use(authenticateUser);
managerRouter.use(authenticateRole(["hotelManager"]));

// Dashboard stats
managerRouter.get("/stats", async (req, res) => {
  try {
    const hotelId = await getHotelIdsByOwnerId(req.user._id);
    if (!hotelId) {
      return res.status(404).json({
        status: "error",
        message: "No hotel found for this owner",
      });
    }
    const analytics = await getHotelMangerHomePageAnalytics(hotelId);

    if (analytics.status === "error") {
      return res.status(500).json(analytics);
    }

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Get manager's bookings
managerRouter.get("/bookings", async (req, res) => {
  try {
    const hotelId = await getHotelIdsByOwnerId(req.user._id);

    if (!hotelId) {
      return res.status(404).json({ message: "No hotel found for this manager" });
    }

    const bookings = await getHotelBookings(hotelId);

    if (bookings.status === "success") {
      res.status(200).json({
        message: "Bookings fetched.",
        bookings: bookings.data,
      });
    } else {
      res.status(404).json({ message: bookings.message || "No bookings found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get/update/delete manager's hotel
managerRouter.get("/hotel", async (req, res) => {
  try {
    const hotelId = await getHotelIdsByOwnerId(req.user._id);
    if (!hotelId) {
      return res.status(404).json({ message: "No hotel found" });
    }
    const hotelData = await getHotelById(hotelId);

    if (hotelData.status === "success") {
      res.status(200).json(hotelData);
    } else {
      res.status(404).json({ message: "Hotel data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching hotel details" });
  }
});

managerRouter.put("/hotel", async (req, res) => {
  try {
    const hotelId = await getHotelIdsByOwnerId(req.user._id);
    const result = await updateHotel(hotelId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

managerRouter.delete("/hotel", async (req, res) => {
  try {
    const hotelId = await getHotelIdsByOwnerId(req.user._id);
    const result = await deleteHotel(hotelId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = managerRouter;
