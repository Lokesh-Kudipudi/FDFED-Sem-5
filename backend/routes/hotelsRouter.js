const express = require("express"); // Import the express module
const {
  getAllHotels,
  getHotelById,
  createHotel,
  getHotelByOwnerId,
} = require("../Controller/hotelController");
const {
  makeHotelBooking,
} = require("../Controller/bookingController");
const {
  addRoomType,
  updateRoomType,
} = require("../Controller/hotelController");

const hotelsRouter = express.Router(); // Create a new router object

// Define a route for the root path of the hotelsRouter
hotelsRouter.route("/").get((req, res) => {
  // Render the "hotels/index" view and pass an object with a name property
  res.render("hotels/index", { user: req.user });
});

hotelsRouter.route("/create").post(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  let response = await createHotel(req.user._id, req.body);

  if (response.status != "success") {
    res.json({
      status: "fail",
      message: response.message,
    });
  } else {
    res.json({
      status: "success",
      message: "Hotel created successfully",
      data: response.data,
    });
  }
});

hotelsRouter.route("/my-hotel").get(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  let response = await getHotelByOwnerId(req.user._id);

  if (response.status != "success") {
    res.json({
      status: "fail",
      message: response.message,
    });
  } else {
    res.json({
      status: "success",
      data: response.data,
    });
  }
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

hotelsRouter.route("/room-type").post(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  // We need the hotel ID. Since the user is a hotel manager (owner),
  // we can find their hotel using getHotelByOwnerId or similar logic.
  // However, the controller addRoomType expects hotelId.
  // Let's first get the hotel for this user.
  let hotelResponse = await getHotelByOwnerId(req.user._id);
  if (hotelResponse.status !== "success" || !hotelResponse.data) {
     return res.status(404).json({
       status: "fail",
       message: "Hotel not found for this user",
     });
  }
  const hotelId = hotelResponse.data._id;

  let response = await addRoomType(hotelId, req.body);

  if (response.status != "success") {
    res.json({
      status: "fail",
      message: response.message,
    });
  } else {
    res.json({
      status: "success",
      message: "Room type added successfully",
      data: response.data,
    });
  }
});

hotelsRouter.route("/room-type/:roomId").put(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  const roomId = req.params.roomId;

   // Get hotel ID for the user
  let hotelResponse = await getHotelByOwnerId(req.user._id);
  if (hotelResponse.status !== "success" || !hotelResponse.data) {
     return res.status(404).json({
       status: "fail",
       message: "Hotel not found for this user",
     });
  }
  const hotelId = hotelResponse.data._id;

  let response = await updateRoomType(hotelId, roomId, req.body);

  if (response.status != "success") {
    res.json({
      status: "fail",
      message: response.message,
    });
  } else {
    res.json({
      status: "success",
      message: "Room type updated successfully",
      data: response.data,
    });
  }
});

module.exports = hotelsRouter; // Export the router object
