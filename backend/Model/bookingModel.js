const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["Hotel", "Tour"],
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Using refPath to dynamically populate based on type
    refPath: "type",
  },
  bookingDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  assignedRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    default: null,
  },
  commissionAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { Booking };