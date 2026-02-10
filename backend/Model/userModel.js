const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    unique: true,
  },
  passwordHash: String,
  phone: String,
  address: String,
  role: {
    type: String,
    enum: ["user", "admin", "hotelManager", "tourGuide"],
    default: "user",
  },
  photo: String, // Profile picture URL
  bookings: [String], // booking IDs
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
