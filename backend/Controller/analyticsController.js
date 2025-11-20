const { Booking } = require("../Model/bookingModel");
const { Tour } = require("../Model/tourModel");
const { Hotel } = require("../Model/hotelModel");
const { User } = require("../Model/userModel");

async function getUserAnalytics(userId) {
  try {
    const bookings = await Booking.find({
      userId: userId,
    }).lean();

    if (!bookings) {
      throw new Error("No bookings found for this user.");
    }

    const toursBookings = bookings.filter(
      (booking) => booking.type === "Tour"
    );
    const hotelsBookings = bookings.filter(
      (booking) => booking.type === "Hotel"
    );

    const totalTours = toursBookings.length;
    const totalHotels = hotelsBookings.length;

    const totalSpentOnTours = toursBookings.reduce(
      (acc, booking) =>
        acc + (booking.bookingDetails?.price || 0),
      0
    );
    const totalSpentOnHotels = hotelsBookings.reduce(
      (acc, booking) => acc + booking.bookingDetails?.price,
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
    const hotels = await User.find({
      role: "hotelManager",
    }).lean();

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.bookingDetails?.price || 0,
      0
    );
    const totalCustomers = customers.length;
    const totalHotels = hotels.length;

    const rawResults = await Booking.aggregate([
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

    return {
      status: "success",
      totalBookings,
      totalRevenue,
      totalCustomers,
      totalHotels,
      populatedResults,
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
      .select(
        "title duration rating status startLocation price _id"
      )
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
        },
      },
    ]);

    const totalPackages = packages.length;
    const activePackages = packages.filter(
      (pkg) => pkg.status === "active"
    ).length;

    const bookingAnalytics = packages.map((pkg) => {
      const bookingsCount =
        bookings.find(
          (booking) =>
            booking._id.toString() === pkg._id.toString()
        )?.totalBookings || 0;
      return {
        ...pkg,
        totalBookings: bookingsCount,
      };
    });

    return {
      status: "success",
      totalPackages,
      activePackages,
      bookingAnalytics,
    };
  } catch (error) {}
}

async function getHotelMangerHomePageAnalytics(hotelId) {
  try {
    const bookings = await Booking.find({
      itemId: hotelId,
    }).lean();

    if (!bookings) {
      throw new Error("No bookings found for this user.");
    }

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.bookingDetails?.price || 0,
      0
    );

    return {
      status: "success",
      totalBookings,
      totalRevenue,
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
};