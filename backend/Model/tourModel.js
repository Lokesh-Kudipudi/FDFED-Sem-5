const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  title: String,
  tourGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  tags: [String],
  mainImage: String,
  rating: Number,
  duration: String,
  startLocation: String,
  description: String,
  language: String,
  price: {
    currency: String,
    amount: Number,
    discount: Number,
  },
  includes: [String],
  destinations: [
    {
      name: String,
      image: String,
    },
  ],
  itinerary: [
    {
      day: Number,
      location: String,
      activities: [String],
    },
  ],
  availableMonths: [String],
  bookingDetails: [
    {
      startDate: String,
      startDay: String,
      endDate: String,
      endDay: String,
      status: String,
      discount: Number,

    },
  ],
  maxPeople: {
    type: Number,
    required: [true, "Tour must have a maximum capacity"],
  },
  commissionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  },
});

// Add Indexes for performance
tourSchema.index({ status: 1 });
tourSchema.index({ startLocation: 1, rating: -1 });
tourSchema.index({ tags: 1 });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = { Tour };
