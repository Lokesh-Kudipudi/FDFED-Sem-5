const express = require("express");
const {
  signUpUser,
  signUphotelManager,
  signUpTourGuide,
  signUpAdmin,
  getUsers,
  fetchUserByEmailPassword,
  logout,
} = require("../Controller/userController");
const { chatGemini } = require("../api/gemini");
const {
  getRecommendedTours,
} = require("../Controller/tourController");
const {
  getAllToursGemini,
} = require("../Controller/tourController");

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

// Define the route for tour guide sign-up page and handle sign-up form submission
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

// Tours for recommendation
let tours = [];

userRouter.route("/recommendation").get(async (req, res) => {
  const recommendedTours = await getRecommendedTours(
    tours.map((tour) => tour._id)
  );

  console.log("Recommended Tours:", recommendedTours);
  res.render("recommendation", {
    user: req.user,
    tours: recommendedTours.data,
  });
});

// Gemini API route
async function fetchTours() {
  const { status, data: toursData } = await getAllToursGemini();
  if (status === "success") {
    return toursData;
  } else {
    return [];
  }
}

let toursData = [];

userRouter.route("/gemini").post(async (req, res) => {
  if (toursData.length === 0) {
    toursData = await fetchTours();
  }
  try {
    /*
    history: [
      { role: "user", parts: [{ text: "Hello" }] },
      { role: "model", parts: [{ text: "<message> Hi there! </message>" }] },
    ], 
    */

    const { userInput, history } = req.body;
    // const historyObj = JSON.parse(history);
    console.log("History:", history);

    const response = await chatGemini(
      userInput,
      history,
      toursData
    );

    const regex =
      /<(message|user_intent|tours|hotels|redirect)>(.*?)<\/\1>/g;
    const matches = [...response.matchAll(regex)];

    const result = {};
    matches.forEach(([, tag, content]) => {
      result[tag] = content.trim();
    });

    if (result.redirect == "yes") {
      if (result.tours) {
        let cleanString = result.tours.replace(
          /,\s*([}\]])/g,
          "$1"
        );
        tours = JSON.parse(cleanString);
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

module.exports = { userRouter };
