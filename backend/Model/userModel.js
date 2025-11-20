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
    enum: ["user", "admin", "hotelManager"],
    default: "user",
  },
  bookings: [String], // booking IDs
});

const User = mongoose.model("User", userSchema);

module.exports = { User };