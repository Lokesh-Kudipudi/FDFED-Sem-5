const express = require("express"); // Import the express module
const {
  getAllHotels,
  getHotelById,
} = require("../Controller/hotelController");
const {
  makeHotelBooking,
} = require("../Controller/bookingController");

const hotelsRouter = express.Router(); // Create a new router object

// Define a route for the root path of the hotelsRouter
hotelsRouter.route("/").get((req, res) => {
  // Render the "hotels/index" view and pass an object with a name property
  res.render("hotels/index", { user: req.user });
});

hotelsRouter.route("/search").get(async (req, res) => {
  let response = await getAllHotels();

  if (response.status != "success") {
    res.json({
      status: "fail",
      message: response.message,
    });
  }

  let hotelsToDisplay = response.data;

  res.json({
    status: "success",
    data: hotelsToDisplay,
  });
});

hotelsRouter.route("/hotel/:id").get(async (req, res) => {
  const id = req.params.id;

  let response = await getHotelById(id);

  if (response.status != "success") {
    res.json({
      stats: "Fail",
      message: response.message,
    });
  }

  const hotel = response.data;

  res.json({
    status: "success",
    data: hotel,
  });
});

hotelsRouter.route("/booking/:id").post(async (req, res) => {
  const id = req.params.id;

  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  let response = await makeHotelBooking(
    req.user._id,
    id,
    req.body
  );

  if (response.status != "success") {
    res.json({
      stats: "Fail",
      message: response.message,
    });
  } else {
    res.json({
      status: "success",
      message: "Booking successful",
    });
  }
});

module.exports = hotelsRouter; // Export the router object
