const express = require("express");
const { authenticateUser, authenticateRole } = require("../../middleware/authentication");
const { Hotel } = require("../Accommodation/hotelModel");
const { Tour } = require("../Tour/tourModel");
const { Booking } = require("../Booking/bookingModel");

const employeeRouter = express.Router();

employeeRouter.use(authenticateUser);
employeeRouter.use(authenticateRole(["employee"]));

const CANCELLED_STATUSES = new Set(["cancel", "cancelled"]);
const COMPLETED_STATUSES = new Set(["complete", "completed"]);

function normalizeStatus(value) {
  return String(value || "pending").toLowerCase().trim();
}

function toNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getDateRange(booking) {
  const details = booking.bookingDetails || {};
  const startDate = details.startDate || details.bookingDate || booking.createdAt || null;
  const endDate = details.endDate || null;
  return { startDate, endDate };
}

function getObjectIdFallbackDate(id) {
  try {
    return id?.getTimestamp?.() || null;
  } catch (_error) {
    return null;
  }
}

function formatBooking(booking) {
  const status = normalizeStatus(booking.bookingDetails?.status);
  const price = toNumber(booking.bookingDetails?.price);

  return {
    _id: booking._id,
    type: booking.type,
    status,
    price,
    user: {
      _id: booking.userId?._id || null,
      fullName: booking.userId?.fullName || "Unknown User",
      email: booking.userId?.email || "",
    },
    item: {
      _id: booking.itemId?._id || null,
      title: booking.itemId?.title || "Unknown Item",
      status: booking.itemId?.status || null,
      location: booking.type === "Hotel" ? booking.itemId?.location || "" : booking.itemId?.startLocation || "",
      rating: booking.itemId?.rating || 0,
    },
    dateRange: getDateRange(booking),
    createdAt: booking.createdAt,
  };
}

async function getAssignedEntities(userId) {
  const [hotels, tours] = await Promise.all([
    Hotel.find({ assignedEmployeeId: userId }).lean(),
    Tour.find({ assignedEmployeeId: userId }).lean(),
  ]);

  return { hotels, tours };
}

async function getBookingsForAssignedItems(hotelIds, tourIds) {
  const matchConditions = [];

  if (hotelIds.length) {
    matchConditions.push({ type: "Hotel", itemId: { $in: hotelIds } });
  }

  if (tourIds.length) {
    matchConditions.push({ type: "Tour", itemId: { $in: tourIds } });
  }

  if (!matchConditions.length) {
    return [];
  }

  const bookings = await Booking.find({ $or: matchConditions })
    .populate("userId", "fullName email")
    .populate("itemId", "title location startLocation rating status")
    .sort({ createdAt: -1 })
    .lean();

  return bookings.filter((booking) => booking.itemId);
}

async function getItemStats(itemIds, type) {
  if (!itemIds.length) {
    return new Map();
  }

  const aggregation = await Booking.aggregate([
    {
      $match: {
        type,
        itemId: { $in: itemIds },
      },
    },
    {
      $addFields: {
        normalizedStatus: {
          $toLower: {
            $ifNull: ["$bookingDetails.status", "pending"],
          },
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

  return new Map(aggregation.map((row) => [String(row._id), row]));
}

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee dashboard and assigned entities
 */

/**
 * @swagger
 * /api/employee/stats:
 *   get:
 *     summary: Get employee dashboard statistics
 *     tags: [Employee]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Employee stats including assigned hotels/tours, booking counts, and revenue
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
 *                   properties:
 *                     totalAssignedHotels:
 *                       type: integer
 *                     totalAssignedTours:
 *                       type: integer
 *                     activeBookings:
 *                       type: integer
 *                     cancelledBookings:
 *                       type: integer
 *                     completedBookings:
 *                       type: integer
 *                     revenueHandled:
 *                       type: number
 *                     recentBookings:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Server error
 */
employeeRouter.get("/stats", async (req, res) => {
  try {
    const { hotels, tours } = await getAssignedEntities(req.user._id);
    const hotelIds = hotels.map((hotel) => hotel._id);
    const tourIds = tours.map((tour) => tour._id);

    const bookings = await getBookingsForAssignedItems(hotelIds, tourIds);
    const normalizedBookings = bookings.map(formatBooking);

    const summary = normalizedBookings.reduce(
      (acc, booking) => {
        if (CANCELLED_STATUSES.has(booking.status)) {
          acc.cancelledBookings += 1;
        } else {
          acc.revenueHandled += booking.price;

          if (COMPLETED_STATUSES.has(booking.status)) {
            acc.completedBookings += 1;
          } else {
            acc.activeBookings += 1;
          }
        }

        return acc;
      },
      {
        activeBookings: 0,
        cancelledBookings: 0,
        completedBookings: 0,
        revenueHandled: 0,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        totalAssignedHotels: hotels.length,
        totalAssignedTours: tours.length,
        activeBookings: summary.activeBookings,
        cancelledBookings: summary.cancelledBookings,
        completedBookings: summary.completedBookings,
        revenueHandled: summary.revenueHandled,
        recentBookings: normalizedBookings.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

/**
 * @swagger
 * /api/employee/hotels:
 *   get:
 *     summary: Get hotels assigned to the employee
 *     tags: [Employee]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of assigned hotels with booking stats
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
 *                       totalBookings:
 *                         type: integer
 *                       totalRevenue:
 *                         type: number
 *       500:
 *         description: Server error
 */
employeeRouter.get("/hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find({ assignedEmployeeId: req.user._id }).lean();
    const hotelIds = hotels.map((hotel) => hotel._id);
    const statsMap = await getItemStats(hotelIds, "Hotel");

    const data = hotels.map((hotel) => {
      const stats = statsMap.get(String(hotel._id));
      return {
        ...hotel,
        assignedDate: getObjectIdFallbackDate(hotel._id),
        totalBookings: stats?.totalBookings || 0,
        totalRevenue: stats?.totalRevenue || 0,
      };
    });

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

/**
 * @swagger
 * /api/employee/tours:
 *   get:
 *     summary: Get tours assigned to the employee
 *     tags: [Employee]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of assigned tours with booking stats
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
 *                       startLocation:
 *                         type: string
 *                       totalBookings:
 *                         type: integer
 *                       totalRevenue:
 *                         type: number
 *       500:
 *         description: Server error
 */
employeeRouter.get("/tours", async (req, res) => {
  try {
    const tours = await Tour.find({ assignedEmployeeId: req.user._id }).lean();
    const tourIds = tours.map((tour) => tour._id);
    const statsMap = await getItemStats(tourIds, "Tour");

    const data = tours.map((tour) => {
      const stats = statsMap.get(String(tour._id));
      return {
        ...tour,
        assignedDate: getObjectIdFallbackDate(tour._id),
        totalBookings: stats?.totalBookings || 0,
        totalRevenue: stats?.totalRevenue || 0,
      };
    });

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

/**
 * @swagger
 * /api/employee/bookings:
 *   get:
 *     summary: Get all bookings for entities assigned to the employee
 *     tags: [Employee]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
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
 *                       type:
 *                         type: string
 *                         enum: [Hotel, Tour]
 *                       status:
 *                         type: string
 *                       price:
 *                         type: number
 *                       user:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                           email:
 *                             type: string
 *                       item:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           location:
 *                             type: string
 *       500:
 *         description: Server error
 */
employeeRouter.get("/bookings", async (req, res) => {
  try {
    const { hotels, tours } = await getAssignedEntities(req.user._id);
    const hotelIds = hotels.map((hotel) => hotel._id);
    const tourIds = tours.map((tour) => tour._id);

    const bookings = await getBookingsForAssignedItems(hotelIds, tourIds);
    const data = bookings.map(formatBooking);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = employeeRouter;
