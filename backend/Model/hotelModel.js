const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  title: String,
  description: String,
  address: String,
  location: String,
  rating: Number,
  currency: String,
  amenities: [String],
  mainImage: String,
  images: [String],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  faq: [
    {
      question: String,
      answer: String,
    },
  ],
  policies: [String],
  features: {
    type: Map,
    of: [String],
  },
  roomType: [
    {
      title: String,
      price: String,
      rating: Number,
      features: [String],
      image: String,
    },
  ],
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "pending"],
  },
  commissionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 100,
  },
});

// Add Indexes for performance
hotelSchema.index({ location: 1 });
hotelSchema.index({ status: 1 });
hotelSchema.index({ rating: -1 });

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = { Hotel };
