const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can't favorite the same tour twice
favouriteSchema.index({ userId: 1, tourId: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);
