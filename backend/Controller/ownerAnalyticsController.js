const { Hotel } = require("../Model/hotelModel");
const { Tour } = require("../Model/tourModel");
const { Booking } = require("../Model/bookingModel");
const { User } = require("../Model/userModel");

// GET /api/owner/analytics/overview
async function getOverviewAnalytics(req, res) {
  try {
    const bookings = await Booking.find({}).lean();
    const customers = await User.find({ role: "user" }).lean();
    const hotels = await Hotel.find({}).lean();
    const totalTours = await Tour.countDocuments({});

    const activeBookings = bookings.filter(
      (b) => b.bookingDetails?.status !== "cancel"
    );

    const totalBookings = activeBookings.length;
    const totalRevenue = activeBookings.reduce(
      (acc, booking) => acc + (booking.bookingDetails?.price || 0),
      0
    );
    const totalCommission = activeBookings.reduce(
      (acc, booking) => acc + (booking.commissionAmount || 0),
      0
    );
    const totalCustomers = customers.length;
    const totalHotels = hotels.length;

    // Monthly bookings for chart
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          "bookingDetails.status": { $ne: "cancel" },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          revenue: { $sum: "$bookingDetails.price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent bookings
    const recentBookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "fullName email")
      .lean();

    res.status(200).json({
      status: "success",
      data: {
        totalRevenue,
        totalCommission,
        totalBookings,
        totalCustomers,
        totalHotels,
        totalTours,
        monthlyBookings,
        recentBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

// GET /api/owner/analytics/hotels
async function getHotelAnalytics(req, res) {
  try {
    const hotels = await Hotel.find({}).populate("ownerId", "fullName email").lean();

    const bookings = await Booking.aggregate([
      { $match: { type: "Hotel" } },
      {
        $group: {
          _id: "$itemId",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$bookingDetails.price" },
          totalCommission: { $sum: "$commissionAmount" },
        },
      },
    ]);

    const hotelsData = hotels.map((hotel) => {
      const stats = bookings.find(
        (b) => b._id.toString() === hotel._id.toString()
      );
      return {
        _id: hotel._id,
        title: hotel.title,
        status: hotel.status || "active",
        manager: hotel.ownerId?.fullName || "Not Assigned",
        managerEmail: hotel.ownerId?.email || "",
        totalBookings: stats?.totalBookings || 0,
        totalRevenue: stats?.totalRevenue || 0,
        totalCommission: stats?.totalCommission || 0,
        commissionRate: hotel.commissionRate || 10,
      };
    });

    res.status(200).json({
      status: "success",
      data: { hotels: hotelsData },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

// GET /api/owner/analytics/tours
async function getTourAnalytics(req, res) {
  try {
    const tours = await Tour.find({}).populate("tourGuideId", "fullName email").lean();

    const bookings = await Booking.aggregate([
      { $match: { type: "Tour" } },
      {
        $group: {
          _id: "$itemId",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$bookingDetails.price" },
          totalCommission: { $sum: "$commissionAmount" },
        },
      },
    ]);

    const toursData = tours.map((tour) => {
      const stats = bookings.find(
        (b) => b._id.toString() === tour._id.toString()
      );
      return {
        _id: tour._id,
        title: tour.title,
        status: tour.status || "active",
        guide: tour.tourGuideId?.fullName || "Not Assigned",
        guideEmail: tour.tourGuideId?.email || "",
        totalBookings: stats?.totalBookings || 0,
        totalRevenue: stats?.totalRevenue || 0,
        totalCommission: stats?.totalCommission || 0,
        commissionRate: tour.commissionRate || 10,
      };
    });

    res.status(200).json({
      status: "success",
      data: { tours: toursData },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

// GET /api/owner/analytics/performance
async function getPerformanceAnalytics(req, res) {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const performance = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          "bookingDetails.status": { $ne: "cancel" },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          bookingsCount: { $sum: 1 },
          revenue: { $sum: "$bookingDetails.price" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formattedData = performance.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      bookings: item.bookingsCount,
      revenue: item.revenue,
    }));

    res.status(200).json({
      status: "success",
      data: { performance: formattedData },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

// GET /api/owner/analytics/bookings
async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate("userId", "fullName email phone")
      .populate("itemId")
      .sort({ createdAt: -1 })
      .lean();

    const validBookings = bookings.filter((b) => b.itemId !== null);

    res.status(200).json({
      status: "success",
      data: { bookings: validBookings },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

module.exports = {
  getOverviewAnalytics,
  getHotelAnalytics,
  getTourAnalytics,
  getPerformanceAnalytics,
  getAllBookings,
};
