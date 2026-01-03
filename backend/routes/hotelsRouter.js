const express = require("express"); // Import the express module
const {
  getAllHotels,
  getHotelById,
  createHotel,
  getHotelByOwnerId,
  deleteHotel,
} = require("../Controller/hotelController");
const {
  makeHotelBooking,
} = require("../Controller/bookingController");
const {
  addRoomType,
  updateRoomType,
  deleteRoomType,
} = require("../Controller/hotelController");

const upload = require("../Middleware/upload");

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

hotelsRouter.route("/room-type").post(upload.single("image"), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  // Handle image upload
  if (req.file) {
    req.body.image = req.file.path;
  }

  // Handle features parsing (FormData sends arrays as strings or duplicate keys)
  if (req.body.features && typeof req.body.features === "string") {
     if (req.body.features.includes(',')) {
         req.body.features = req.body.features.split(',').map(s => s.trim()).filter(Boolean);
     } else {
         // Single feature
         req.body.features = [req.body.features];
     }
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

hotelsRouter.route("/room-type/:roomId").put(upload.single("image"), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  // Handle image upload
  if (req.file) {
    req.body.image = req.file.path;
  }
  
  // Handle features parsing
  if (req.body.features && typeof req.body.features === "string") {
     if (req.body.features.includes(',')) {
         req.body.features = req.body.features.split(',').map(s => s.trim()).filter(Boolean);
     } else {
         req.body.features = [req.body.features];
     }
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

hotelsRouter.route("/room-type/:roomId").delete(async (req, res) => {
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

  let response = await deleteRoomType(hotelId, roomId);

  if (response.status != "success") {
    return res.status(400).json({
      status: "fail",
      message: response.message,
    });
  }

  res.json({
    status: "success",
    message: "Room type deleted successfully",
    data: response.data,
  });
});

// DELETE route to remove a hotel by ID (admin only)
hotelsRouter.route("/hotel/:id").delete(async (req, res) => {
  const id = req.params.id;

  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  let response = await deleteHotel(id);

  if (response.status != "success") {
    return res.status(400).json({
      status: "fail",
      message: response.message,
    });
  }

  res.json({
    status: "success",
    message: "Hotel deleted successfully",
  });
});

module.exports = hotelsRouter; // Export the router object
