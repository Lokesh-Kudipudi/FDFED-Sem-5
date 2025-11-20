const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = { Owner };