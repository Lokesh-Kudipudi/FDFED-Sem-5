const express = require("express");
const {
  signUpUser,
  signUphotelManager,
  signUpTourGuide,
  signUpAdmin,
  getUsers,
  fetchUserByEmailPassword,
  logout,
  updatePassword,
  deleteAccount,
  forgotPassword,
  verifyOTP,
  resetPasswordWithToken,
} = require("../Controller/userController");
const { chatGemini } = require("../api/gemini");
const {
  getRecommendedTours,
  getAllToursGemini,
} = require("../Controller/tourController");
const {
  getAllHotelsGemini,
  getRecommendedHotels,
} = require("../Controller/hotelController");
const { authenticateUser } = require("../Middleware/authentication");

const userRouter = express.Router();

// Define the route for the sign-up page and handle sign-up form submission
userRouter
  .route("/signUp")
  .get((req, res) => {
    res.sendFile("/html/auth/signUp.html", { root: "public" });
  })
  .post(signUpUser);

// Define the route for hotel manager sign-up page and handle sign-up form submission
userRouter
  .route("/signUpHotelManager")
  .get((req, res) => {
    res.sendFile("/html/auth/signUpHotelManager.html", {
      root: "public",
    });
  })
  .post(signUphotelManager);

// Define the route for the sign-up page for tour guides
userRouter.route("/signUpTourGuide").post(signUpTourGuide);

// Define the route for the sign-in page and handle sign-in form submission
userRouter
  .route("/signIn")
  .get((req, res) => {
    res.sendFile("/html/auth/signIn.html", { root: "public" });
  })
  .post(fetchUserByEmailPassword);

// Define the route for the sign-out
userRouter.route("/logout").get(logout);

// Define the route to get all users
userRouter.route("/users").get(getUsers).post(signUpAdmin);

// Define the route to update password
userRouter.route("/updatePassword").post(authenticateUser, updatePassword);

// Define the route to delete account
userRouter.route("/delete-account").delete(authenticateUser, deleteAccount);

// Define the route to get all tour guides
userRouter.route("/tourGuides").get(async (req, res) => {
  try {
    const { User } = require("../Model/userModel");
    const tourGuides = await User.find({ role: "tourGuide" }).select(
      "fullName email _id"
    );
    res.json({
      status: "success",
      data: tourGuides,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});
async function fetchTours() {
  const { status, data: toursData } = await getAllToursGemini();
  if (status === "success") {
    return toursData;
  } else {
    return [];
  }
}

async function fetchHotels() {
  const { status, data: hotelsData } = await getAllHotelsGemini();
  if (status === "success") {
    return hotelsData;
  } else {
    return [];
  }
}

let toursData = [];
let hotelsData = [];

userRouter.route("/gemini").post(async (req, res) => {
  if (toursData.length === 0) {
    toursData = await fetchTours();
  }
  if (hotelsData.length === 0) {
    hotelsData = await fetchHotels();
  }
  try {
    const { userInput, history } = req.body;

    const response = await chatGemini(
      userInput,
      history,
      toursData,
      hotelsData
    );

    const regex =
      /<(message|user_intent|tours|hotels|redirect)>([\s\S]*?)<\/\1>/g;
    const matches = [...response.matchAll(regex)];

    const result = {};
    matches.forEach(([, tag, content]) => {
      result[tag] = content.trim();
    });

    console.log(result);

    if (result.redirect == "yes") {
      if (result.tours) {
        let cleanString = result.tours.replace(/,\s*([}\]])/g, "$1");
        tours = JSON.parse(cleanString);
      }
      if (result.hotels) {
        let cleanString = result.hotels.replace(/,\s*([}\]])/g, "$1");
        hotels = JSON.parse(cleanString);
      }
    }

    res.json({
      status: "success",
      googleResponse: response,
      data: result,
    });
  } catch (error) {
    console.error("Error in Gemini API route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Forgot Password Routes
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/verify-otp").post(verifyOTP);
userRouter.route("/reset-password").post(resetPasswordWithToken);

module.exports = userRouter;
module.exports = { userRouter };
