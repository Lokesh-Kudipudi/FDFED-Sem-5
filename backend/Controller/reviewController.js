const Review = require("../Model/reviewModel");
const Tour = require("../Model/tourModel");
const Hotel = require("../Model/hotelModel");

exports.createReview = async (req, res) => {
  try {
    // userId came from authenticateUser middleware
    const userId = req.user.id || req.user._id; 
    const { itemId, itemType, rating, review } = req.body;

    if (!itemId || !itemType || !rating || !review) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required (itemId, itemType, rating, review).",
      });
    }

    const newReview = await Review.create({
      userId,
      itemId,
      itemType,
      rating,
      review,
    });
    
    // Optional: Update average rating on the Tour/Hotel model
    // This is a "nice to have" but ensures consistency.
    // For now we just save the review.

    res.status(201).json({
      status: "success",
      data: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

exports.getReviewsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ itemId }).populate("userId", "fullName");

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};
