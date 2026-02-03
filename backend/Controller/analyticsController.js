const mongoose = require("mongoose");
const { Booking } = require("../Model/bookingModel");
const { Tour } = require("../Model/tourModel");
const { Hotel } = require("../Model/hotelModel");
const { User } = require("../Model/userModel");
const CustomTourRequest = require("../Model/CustomTourRequest");

async function getUserAnalytics(userId) {
  try {
    const bookings = await Booking.find({
      userId: userId,
    }).lean();

    if (!bookings) {
      throw new Error("No bookings found for this user.");
    }

    const toursBookings = bookings.filter((booking) => booking.type === "Tour");
    const hotelsBookings = bookings.filter(
      (booking) => booking.type === "Hotel"
    );

    const totalTours = toursBookings.length;
    const totalHotels = hotelsBookings.length;

    const totalSpentOnTours = toursBookings.reduce(
      (acc, booking) => acc + (booking.bookingDetails?.price || 0),
      0
    );
    const totalSpentOnHotels = hotelsBookings.reduce(
      (acc, booking) => acc + (booking.bookingDetails?.price || 0),
      0
    );

    return {
      status: "success",
      totalHotels,
      totalTours,
      totalSpentOnHotels,
      totalSpentOnTours,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function getAdminHomepageAnalytics() {
  // Total Bookings Revenue Customers and Hotels
  try {
    const bookings = await Booking.find({}).lean();
    const customers = await User.find({ role: "user" }).lean();
    const hotels = await Hotel.find({}).lean();

    // Filter out cancelled bookings (status is "cancel")
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

    const rawResults = await Booking.aggregate([
      {
        $match: {
          "bookingDetails.status": { $ne: "cancel" },
        },
      },
      {
        $group: {
          _id: { itemId: "$itemId", type: "$type" },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
    ]);

    // Then in Node.js, loop and populate manually:
    const populatedResults = await Promise.all(
      rawResults.map(async (entry) => {
        let item;
        if (entry._id.type === "Tour") {
          item = await Tour.findById(entry._id.itemId)
            .select("mainImage title")
            .lean();
        } else if (entry._id.type === "Hotel") {
          item = await Hotel.findById(entry._id.itemId)
            .select("mainImage title")
            .lean();
        }
        return {
          ...entry,
          item,
        };
      })
    );

    // Get The Top Bookings according to frequency

    // Get Recent Bookings
    const recentBookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "fullName email")
      .lean();

    // Monthly Bookings for Chart
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
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      status: "success",
      totalBookings,
      totalRevenue,
      totalCommission,
      totalCustomers,
      totalHotels,
      populatedResults,
      recentBookings,
      monthlyBookings,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function getAdminPackagesAnalytics() {
  try {
    const packages = await Tour.find({})
      .select("title duration rating startLocation price commissionRate _id mainImage status")
      .lean();

    // Use Aggregate and find the total bookings for each package
    const bookings = await Booking.aggregate([
      {
        $match: {
          type: "Tour",
        },
      },
      {
        $group: {
          _id: "$itemId",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$bookingDetails.price" },
          totalCommission: { $sum: "$commissionAmount" },
        },
      },
    ]);

    const totalPackages = packages.length;
    const activePackages = packages.filter(
      (pkg) => (pkg.status || "active") === "active"
    ).length;

    const bookingAnalytics = packages.map((pkg) => {
      const stats = bookings.find(
        (booking) => booking._id.toString() === pkg._id.toString()
      );
      return {
        ...pkg,
        status: pkg.status || "active",
        totalBookings: stats?.totalBookings || 0,
        totalRevenue: stats?.totalRevenue || 0,
        totalCommission: stats?.totalCommission || 0,
      };
    });

    return {
      status: "success",
      totalPackages,
      activePackages,
      bookingAnalytics,
    };
  } catch (error) {
    return {
        status: "error",
        message: error.message
    }
  }
}

async function getHotelMangerHomePageAnalytics(hotelId) {
  try {
    const bookings = await Booking.find({
      itemId: hotelId,
    })
      .populate("userId", "fullName email phone")
      .lean();

    if (!bookings) {
      return {
        status: "success",
        totalBookings: 0,
        totalRevenue: 0,
        recentBookings: [],
        monthlyBookings: [],
        bookingStatusCounts: {
          booked: 0,
          cancelled: 0,
          checkedIn: 0,
          completed: 0,
        },
      };
    }

    // Exclude cancelled bookings from calculations
    const activeBookings = bookings.filter(b => {
      const s = b.bookingDetails?.status?.toLowerCase();
      return s !== "cancel" && s !== "cancelled";
    });

    const totalBookings = activeBookings.length;
    const totalRevenue = activeBookings.reduce(
      (acc, booking) => acc + (booking.bookingDetails?.price || 0),
      0
    );

    // Recent Bookings (Last 5)
    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Monthly Bookings for Chart (excluding cancelled)
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          itemId: new mongoose.Types.ObjectId(hotelId),
          "bookingDetails.status": { 
             $nin: ["cancel", "cancelled", "Cancel", "Cancelled"] 
          }
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

    const commissionPaid = activeBookings.reduce((acc, b) => {
        return acc + (b.commissionAmount || 0);
    }, 0);

    // Booking Status Counts
    const bookingStatusCounts = bookings.reduce(
      (acc, booking) => {
        const status =
          booking.bookingDetails?.status?.toLowerCase() || "unknown";
        if (acc[status] !== undefined) {
          acc[status]++;
        }
        return acc;
      },
      { booked: 0, cancel: 0, checkedin: 0, complete: 0 }
    );

    return {
      status: "success",
      totalBookings,
      status: "success",
      totalBookings,
      totalRevenue,
      commissionPaid,
      recentBookings,
      monthlyBookings,
      bookingStatusCounts,
    };
  } catch (error) {
    console.error("Error in getHotelMangerHomePageAnalytics:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function getAdminHotelAnalytics() {
  try {
    const hotels = await Hotel.find({}).lean();

    // Aggregate bookings for hotels
    const bookings = await Booking.aggregate([
      {
        $match: {
          type: "Hotel",
        },
      },
      {
        $group: {
          _id: "$itemId",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$bookingDetails.price" },
          totalCommission: { $sum: "$commissionAmount" },
        },
      },
    ]);

    const totalHotels = hotels.length;
    const activeHotels = hotels.filter(
      (h) => h.status && h.status.toLowerCase() === "active"
    ).length;
    const pendingHotels = hotels.filter(
      (h) => h.status && h.status.toLowerCase() === "pending"
    ).length;
    const inactiveHotels = hotels.filter(
      (h) => h.status && h.status.toLowerCase() === "inactive"
    ).length;

    const hotelAnalytics = hotels.map((hotel) => {
      const stats = bookings.find(
        (b) => b._id.toString() === hotel._id.toString()
      );
      return {
        ...hotel,
        totalBookings: stats?.totalBookings || 0,
        totalRevenue: stats?.totalRevenue || 0,
        totalCommission: stats?.totalCommission || 0,
        commissionRate: hotel.commissionRate || 10,
      };
    });

    // Top 5 Hotels by Revenue
    const topHotels = [...hotelAnalytics]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    return {
      status: "success",
      totalHotels,
      activeHotels,
      pendingHotels,
      inactiveHotels,
      hotelAnalytics,
      topHotels,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}
async function getTourGuideAnalytics(guideId) {
  try {
    // 1. Get all tours by this guide
    const tours = await Tour.find({ tourGuideId: guideId }).lean();
    const tourIds = tours.map((t) => t._id);

    // 2. Get all bookings for these tours
    const bookings = await Booking.find({
      itemId: { $in: tourIds },
      type: "Tour",
    }).lean();

    const totalTours = tours.length;
    const activeBookings = bookings.filter(
      (b) => b.bookingDetails?.status === "confirmed" || b.bookingDetails?.status === "pending"
    ).length;

    let totalRevenue = bookings.reduce((acc, b) => {
      // Assuming 'confirmed' means payment received/revenue valid
      if (b.bookingDetails?.status === "confirmed") {
        return acc + (b.bookingDetails?.price || 0);
      }
      return acc;
    }, 0);

    const commissionPaid = bookings.reduce((acc, b) => {
        if (b.bookingDetails?.status === "confirmed" || b.bookingDetails?.status === "pending" || b.bookingDetails?.status === "booked") {
             return acc + (b.commissionAmount || 0);
        }
        return acc;
    }, 0);

    // 3. Get Accepted Custom Tours
    const acceptedCustomToursList = await CustomTourRequest.find({
      assignedTourGuide: guideId,
      status: "accepted",
    }).lean();

    const acceptedCustomTours = acceptedCustomToursList.length;

    const customTourRevenue = acceptedCustomToursList.reduce((acc, tour) => {
      // Find the quote provided by this guide
      const winningQuote = tour.quotes.find(q => q.tourGuideId.toString() === guideId.toString());
      return acc + (winningQuote ? (winningQuote.amount || 0) : 0);
    }, 0);

    totalRevenue += customTourRevenue;

    return {
      status: "success",
      totalTours,
      activeBookings,
      totalTours,
      activeBookings,
      totalRevenue,
      commissionPaid,
      acceptedCustomTours,
      customTourRevenue
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

module.exports = {
  getUserAnalytics,
  getAdminHomepageAnalytics,
  getAdminPackagesAnalytics,
  getHotelMangerHomePageAnalytics,
  getAdminHotelAnalytics,
  getTourGuideAnalytics,
};
