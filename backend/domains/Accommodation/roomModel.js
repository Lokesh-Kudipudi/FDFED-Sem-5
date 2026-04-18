const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, "Room number is required"],
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "Room must belong to a hotel"],
  },
  roomTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Room must have a type ID"],
  },
  roomType: {
    type: String, // Snapshot of the room type name e.g. "Deluxe Double"
    required: false,
  },
  floorNumber: {
    type: Number,
    required: false,
  },
  price: {
    type: Number, // Optional override price, otherwise use room type price
    required: false,
  },
  status: {
    type: String,
    enum: ["available", "occupied", "maintenance"],
    default: "available",
  },
  currentBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null,
  },
});

// Compound index to ensure unique room numbers per hotel
roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.model("Room", roomSchema);

module.exports = { Room };
