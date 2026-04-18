const express = require("express");
const { authenticateUser, authenticateRole } = require("../../middleware/authentication");
const { getHotelMangerHomePageAnalytics } = require("../AdminAndCore/analyticsController");
const { getHotelBookings } = require("../Booking/bookingController");
const { getHotelIdsByOwnerId } = require("../AdminAndCore/ownerController");
const { getHotelById, updateHotel, deleteHotel, getHotelsByOwnerId } = require("./hotelController");
const { Booking } = require("../Booking/bookingModel");
const mongoose = require("mongoose");

/**
 * @swagger
 * tags:
 *   name: Hotel Manager
 *   description: Endpoints for hotel managers
 */

/**
 * @swagger
 * /api/manager/stats:
 *   get:
 *     summary: Get dashboard stats
 *     tags: [Hotel Manager]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 * 
 * /api/manager/bookings:
 *   get:
 *     summary: Get manager's bookings
 *     tags: [Hotel Manager]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 * 
 * /api/manager/hotels:
 *   get:
 *     summary: Get manager's hotels with revenue and booking counts
 *     tags: [Hotel Manager]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hotels data retrieved successfully
 * 
 * /api/manager/hotel:
 *   get:
 *     summary: Get a specific hotel managed by the user
 *     tags: [Hotel Manager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel retrieved successfully
 *   put:
 *     summary: Update a managed hotel
 *     tags: [Hotel Manager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *   delete:
 *     summary: Delete a managed hotel
 *     tags: [Hotel Manager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 */
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

/**
 * @swagger
 * tags:
 *   name: Manager
 *   description: Hotel manager dashboard and hotel management
 */

/**
 * @swagger
 * /api/manager/stats:
 *   get:
 *     summary: Get hotel manager dashboard statistics
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Manager analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *       404:
 *         description: No hotel found for this owner
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/manager/bookings:
 *   get:
 *     summary: Get bookings for the manager's hotel
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         description: Optional specific hotel ID (if manager owns multiple)
 *     responses:
 *       200:
 *         description: List of hotel bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No hotel or bookings found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/manager/hotels:
 *   get:
 *     summary: Get all hotels owned by the manager with revenue and booking stats
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of hotels with stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       location:
 *                         type: string
 *                       status:
 *                         type: string
 *                       totalBookings:
 *                         type: integer
 *                       totalRevenue:
 *                         type: number
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/manager/hotel:
 *   get:
 *     summary: Get a specific hotel owned by the manager
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         description: Optional hotel ID
 *     responses:
 *       200:
 *         description: Hotel details
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/manager/hotel:
 *   put:
 *     summary: Update manager's hotel details
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         description: Optional hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               location:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Hotel updated
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/manager/hotel:
 *   delete:
 *     summary: Delete manager's hotel
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         description: Optional hotel ID
 *     responses:
 *       200:
 *         description: Hotel deleted
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Server error
 */
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
