const { Booking } = require("../Model/bookingModel");
const { Tour } = require("../Model/tourModel");
const { Hotel } = require("../Model/hotelModel");

async function getUserBookings(userId) {
  try {
    const bookings = await Booking.find({ userId: userId })
      .populate("userId")
      .populate({
        path: "itemId",
      })
      .lean();

    if (!bookings || bookings.length === 0) {
      return {
        status: "success",
        data: [],
        message: "No bookings found for this user.",
      };
    }

    const validBookings = bookings.filter(
      (booking) => booking.itemId !== null
    );

    if (validBookings.length !== bookings.length) {
      console.warn(
        `${
          bookings.length - validBookings.length
        } bookings had invalid itemId references`
      );
    }

    return {
      status: "success",
      data: validBookings,
    };
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function getHotelBookings(hotelId) {
  try {
    const bookings = await Booking.find({ itemId: hotelId })
      .populate("userId")
      .lean();

    if (!bookings) {
      throw new Error("No bookings found for this hotel.");
    }

    return {
      status: "success",
      data: bookings,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function makeTourBooking(userId, tourId, bookingDetails) {
  try {
    const tour = await Tour.findById(tourId);
    if (!tour) {
      throw new Error("Tour not found.");
    }
    
    // Calculate price per person
    const pricePerPerson = tour.price.amount - tour.price.discount * tour.price.amount;
    
    // Determine number of guests (default to 1 if not provided)
    const numGuests = bookingDetails.numGuests || 1;
    
    // Calculate total price based on guests
    // If frontend sends totalAmount, we can validate it or just recalculate to be safe
    const totalPrice = pricePerPerson * numGuests;

    const booking = new Booking({
      userId,
      type: "Tour",
      itemId: tourId,
      bookingDetails: {
        ...bookingDetails,
        status: bookingDetails.status || "pending",
        bookingDate: new Date(),
        price: totalPrice, // Save the total price
        pricePerPerson: pricePerPerson, // Save unit price for reference
      },
    });

    const savedBooking = await booking.save();

    return {
      status: "success",
      data: {
        booking: savedBooking,
      },
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function makeHotelBooking(
  userId,
  hotelId,
  bookingDetails
) {
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found.");
    }
    const booking = new Booking({
      userId,
      type: "Hotel",
      itemId: hotelId,
      bookingDetails: {
        ...bookingDetails,
        status: bookingDetails.status || "pending",
        bookingDate: new Date(),
      },
    });

    const savedBooking = await booking.save();

    return {
      status: "success",
      data: {
        booking: savedBooking,
      },
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function cancelBooking(bookingId) {
  try {
    const result = await Booking.updateOne(
      { _id: bookingId, "bookingDetails.status": "pending" },
      { $set: { "bookingDetails.status": "cancel" } }
    );

    if (result.modifiedCount === 1) {
      console.log("Booking status updated to cancel.");

      return {
        status: "success",
        message: "Booking cancelled successfully.",
      };
    } else {
      console.log(
        "No pending booking found or already updated."
      );

      return {
        status: "error",
        message: "Booking not found or already cancelled.",
      };
    }
  } catch (error) {
    console.error("Error updating booking status:", error);
  }
}

async function getTourGuideBookings(guideId) {
  try {
    // 1. Get all tours by this guide
    const tours = await Tour.find({ tourGuideId: guideId }).lean();
    const tourIds = tours.map((t) => t._id);

    // 2. Get all bookings for these tours
    const bookings = await Booking.find({
      itemId: { $in: tourIds },
      type: "Tour",
    })
      .populate("userId", "fullName email")
      .populate("itemId", "title") // Populate tour details
      .lean();

    // Map to a friendlier format if needed, or just return
    const formattedBookings = bookings.map(b => ({
      _id: b._id,
      tour: b.itemId, // Populated tour
      user: b.userId, // Populated user
      startDate: b.bookingDetails?.startDate,
      status: b.bookingDetails?.status,
      price: b.bookingDetails?.price,
      createdAt: b.createdAt
    }));

    return {
      status: "success",
      data: formattedBookings,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

module.exports = {
  getUserBookings,
  getHotelBookings,
  makeTourBooking,
  makeHotelBooking,
  cancelBooking,
  getTourGuideBookings,
  getAllBookingsAdmin,
  getBookingDetailsAdmin,
  cancelBookingAdmin,
};

// Admin Functions
const CustomTourRequest = require("../Model/CustomTourRequest");

// Admin Functions
async function getAllBookingsAdmin() {
  try {
    const bookings = await Booking.find()
      .populate("userId", "fullName email phone")
      .populate("itemId")
      .sort({ createdAt: -1 })
      .lean();

    const validBookings = bookings.filter((booking) => booking.itemId !== null);

    // Fetch Custom Tour Requests
    const customTours = await CustomTourRequest.find()
      .populate("userId", "fullName email phone")
      .sort({ createdAt: -1 })
      .lean();

    // Format Custom Tours to match Booking structure
    const formattedCustomTours = customTours.map((tour) => ({
      _id: tour._id,
      userId: tour.userId,
      type: "Custom Tour",
      itemId: {
        title: tour.title,
        ...tour,
      },
      bookingDetails: {
        status: tour.status,
        startDate: tour.travelDates?.startDate,
        price: tour.budget,
      },
      createdAt: tour.createdAt,
    }));

    // Merge and sort
    const allBookings = [...validBookings, ...formattedCustomTours].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
      status: "success",
      data: allBookings,
    };
  } catch (error) {
    console.error("Error in getAllBookingsAdmin:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function getBookingDetailsAdmin(bookingId) {
  try {
    const booking = await Booking.findById(bookingId)
      .populate("userId")
      .populate("itemId")
      .lean();

    if (!booking) {
      return {
        status: "error",
        message: "Booking not found",
      };
    }

    return {
      status: "success",
      data: booking,
    };
  } catch (error) {
    console.error("Error in getBookingDetailsAdmin:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
}

async function cancelBookingAdmin(bookingId) {
  try {
    // Try to cancel standard booking first
    let result = await Booking.updateOne(
      { _id: bookingId },
      { $set: { "bookingDetails.status": "cancel" } }
    );

    if (result.modifiedCount === 1) {
      return {
        status: "success",
        message: "Booking cancelled successfully",
      };
    }

    // If not found, try to cancel Custom Tour Request
    result = await CustomTourRequest.updateOne(
      { _id: bookingId },
      { $set: { status: "cancelled" } }
    );

    if (result.modifiedCount === 1) {
      return {
        status: "success",
        message: "Custom Tour Request cancelled successfully",
      };
    }

    return {
      status: "error",
      message: "Booking not found or already cancelled",
    };
  } catch (error) {
    console.error("Error in cancelBookingAdmin:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
}