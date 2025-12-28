const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Dynamic reference based on itemType could be complex, 
      // but for now we just store the ID.
    },
    itemType: {
      type: String,
      required: true,
      enum: ["Tour", "Hotel"],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    userType: {
        type: String,
        default: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
