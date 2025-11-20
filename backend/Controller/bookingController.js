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
    const booking = new Booking({
      userId,
      type: "Tour",
      itemId: tourId,
      bookingDetails: {
        ...bookingDetails,
        status: bookingDetails.status || "pending",
        bookingDate: new Date(),
        price:
          tour.price.amount -
          tour.price.discount * tour.price.amount,
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

module.exports = {
  getUserBookings,
  getHotelBookings,
  makeTourBooking,
  makeHotelBooking,
  cancelBooking,
};