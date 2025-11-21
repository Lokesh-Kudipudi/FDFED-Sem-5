const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  title: String,
  tags: [String],
  mainImage: String,
  images: [String],
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
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = { Tour };
