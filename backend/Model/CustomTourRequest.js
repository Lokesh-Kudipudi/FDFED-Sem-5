const mongoose = require("mongoose");

const customTourRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    places: {
      type: [String],
      required: true,
    },
    hotelRequirements: {
      type: {
        type: String,
        enum: ["budget", "mid-range", "luxury"],
        default: "mid-range",
      },
      preferences: String,
    },
    additionalRequirements: String,
    budget: {
      type: Number,
      required: true,
    },
    travelDates: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    numPeople: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "quoted", "bargaining", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
    assignedTourGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quotes: [
      {
        tourGuideId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        tourGuideName: String,
        amount: Number,
        message: String,
        itinerary: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bargains: [
      {
        fromUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    acceptedQuote: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
customTourRequestSchema.index({ userId: 1, status: 1 });
customTourRequestSchema.index({ "quotes.tourGuideId": 1 });

const CustomTourRequest = mongoose.model("CustomTourRequest", customTourRequestSchema);

module.exports = CustomTourRequest;
