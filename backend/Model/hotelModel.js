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
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = { Hotel };
