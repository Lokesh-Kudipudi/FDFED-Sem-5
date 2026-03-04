const express = require("express");
const { authenticateUser, authenticateRole } = require("../middleware/authentication");
const { getHotelMangerHomePageAnalytics } = require("../Controller/analyticsController");
const { getHotelBookings } = require("../Controller/bookingController");
const { getHotelIdsByOwnerId } = require("../Controller/ownerController");
const { getHotelById, updateHotel, deleteHotel, getHotelsByOwnerId } = require("../Controller/hotelController");
const { Booking } = require("../Model/bookingModel");
const mongoose = require("mongoose");

const managerRouter = express.Router();

// Apply authentication and role check
managerRouter.use(authenticateUser);
managerRouter.use(authenticateRole(["hotelManager"]));

async function resolveManagerHotelId(userId, requestedHotelId) {
  if (requestedHotelId) {
    if (!mongoose.Types.ObjectId.isValid(requestedHotelId)) {
      return null;
    }
    const ownedHotels = await getHotelsByOwnerId(userId);
    if (ownedHotels.status !== "success") return null;
    const found = ownedHotels.data.find((h) => String(h._id) === String(requestedHotelId));
    return found ? found._id : null;
  }

  return getHotelIdsByOwnerId(userId);
}

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
    const hotelId = await resolveManagerHotelId(req.user._id, req.query.hotelId);

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

// Get manager's hotels with revenue and booking counts
managerRouter.get("/hotels", async (req, res) => {
  try {
    const hotelsResult = await getHotelsByOwnerId(req.user._id);
    if (hotelsResult.status !== "success") {
      return res.status(500).json({ status: "error", message: "Failed to fetch hotels" });
    }

    const hotels = hotelsResult.data || [];
    if (hotels.length === 0) {
      return res.status(200).json({ status: "success", data: [] });
    }

    const hotelIds = hotels.map((h) => h._id);
    const stats = await Booking.aggregate([
      {
        $match: {
          type: "Hotel",
          itemId: { $in: hotelIds },
        },
      },
      {
        $addFields: {
          normalizedStatus: {
            $toLower: { $ifNull: ["$bookingDetails.status", ""] },
          },
          cleanPrice: {
            $convert: {
              input: "$bookingDetails.price",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: "$itemId",
          totalBookings: {
            $sum: {
              $cond: [{ $in: ["$normalizedStatus", ["cancel", "cancelled"]] }, 0, 1],
            },
          },
          totalRevenue: {
            $sum: {
              $cond: [{ $in: ["$normalizedStatus", ["cancel", "cancelled"]] }, 0, "$cleanPrice"],
            },
          },
        },
      },
    ]);

    const statsMap = new Map(stats.map((s) => [String(s._id), s]));
    const payload = hotels.map((hotel) => {
      const hotelStats = statsMap.get(String(hotel._id));
      return {
        ...hotel,
        totalBookings: hotelStats?.totalBookings || 0,
        totalRevenue: hotelStats?.totalRevenue || 0,
      };
    });

    res.status(200).json({ status: "success", data: payload });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Get/update/delete manager's hotel
managerRouter.get("/hotel", async (req, res) => {
  try {
    const hotelId = await resolveManagerHotelId(req.user._id, req.query.hotelId);
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
    const hotelId = await resolveManagerHotelId(req.user._id, req.query.hotelId);
    if (!hotelId) {
      return res.status(404).json({ status: "error", message: "Hotel not found for this manager" });
    }
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
    const hotelId = await resolveManagerHotelId(req.user._id, req.query.hotelId);
    if (!hotelId) {
      return res.status(404).json({ status: "error", message: "Hotel not found for this manager" });
    }
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
