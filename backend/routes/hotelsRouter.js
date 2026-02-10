const express = require("express"); // Import the express module
const {
  getAllHotels,
  getHotelById,
  createHotel,
  getHotelByOwnerId,
} = require("../Controller/hotelController");
const {
  makeHotelBooking,
  getHotelBookedDates,
} = require("../Controller/bookingController");
const {
  addRoomType,
  updateRoomType,
  deleteRoomType,
} = require("../Controller/hotelController");

const {
  createRoom,
  getRoomsByHotel,
  updateRoom,
  deleteRoom,
  assignRoomToBooking
} = require("../Controller/roomController");

const upload = require("../middleware/upload");

const hotelsRouter = express.Router(); // Create a new router object

hotelsRouter.route("/").post(async (req, res) => {
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
}).get(async (req, res) => {
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

hotelsRouter.route("/room-types").post(upload.single("image"), async (req, res) => {
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

hotelsRouter.route("/room-types/:roomId").put(upload.single("image"), async (req, res) => {
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

hotelsRouter.route("/room-types/:roomId").delete(async (req, res) => {
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

// ROOM MANAGEMENT ROUTES

// Create Room
hotelsRouter.route("/rooms").post(async (req, res) => {
    if (!req.user) return res.status(401).json({ status: "fail", message: "User not authenticated" });
    
    // Get Hotel ID
    let hotelResponse = await getHotelByOwnerId(req.user._id);
    if (hotelResponse.status !== "success" || !hotelResponse.data) {
        return res.status(404).json({ status: "fail", message: "Hotel not found" });
    }
    const hotelId = hotelResponse.data._id;

    let response = await createRoom(hotelId, req.body);
    if (response.status !== "success") {
        res.status(400).json(response);
    } else {
        res.json(response);
    }
});

// Get Rooms
hotelsRouter.route("/rooms").get(async (req, res) => {
    if (!req.user) return res.status(401).json({ status: "fail", message: "User not authenticated" });
    
    // Get Hotel ID
    let hotelResponse = await getHotelByOwnerId(req.user._id);
    if (hotelResponse.status !== "success" || !hotelResponse.data) {
        return res.status(404).json({ status: "fail", message: "Hotel not found" });
    }
    const hotelId = hotelResponse.data._id;

    let response = await getRoomsByHotel(hotelId);
    if (response.status !== "success") {
        res.status(400).json(response);
    } else {
        res.json(response);
    }
});

// Update/Delete Room
hotelsRouter.route("/rooms/:id")
    .put(async (req, res) => {
        if (!req.user) return res.status(401).json({ status: "fail", message: "User not authenticated" });
        // NOTE: We should ideally verify the room belongs to the user's hotel here, but for now assuming manager has access
        let response = await updateRoom(req.params.id, req.body);
        if (response.status !== "success") {
            res.status(400).json(response);
        } else {
            res.json(response);
        }
    })
    .delete(async (req, res) => {
         if (!req.user) return res.status(401).json({ status: "fail", message: "User not authenticated" });
        let response = await deleteRoom(req.params.id);
        if (response.status !== "success") {
            res.status(400).json(response);
        } else {
            res.json(response);
        }
    });

// Assign Room to Booking
hotelsRouter.route("/bookings/:bookingId/assign-room").post(async (req, res) => {
    if (!req.user) return res.status(401).json({ status: "fail", message: "User not authenticated" });
    
    const { roomId } = req.body;
    if (!roomId) return res.status(400).json({ status: "fail", message: "Room ID is required" });

    let response = await assignRoomToBooking(req.params.bookingId, roomId);
    if (response.status !== "success") {
        res.status(400).json(response);
    } else {
        res.json(response);
    }
});

hotelsRouter.route("/:id").get(async (req, res) => {
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

hotelsRouter.route("/:id/book").post(async (req, res) => {
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
      status: "fail",
      message: response.message,
    });
  } else {
    res.json({
      status: "success",
      message: "Booking successful",
    });
  }
});

hotelsRouter.route("/:id/availability").get(async (req, res) => {
  const hotelId = req.params.id;
  const { roomTypeId } = req.query;

  if (!roomTypeId) {
    return res.status(400).json({
      status: "fail",
      message: "Room Type ID is required",
    });
  }

  let response = await getHotelBookedDates(hotelId, roomTypeId);

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


module.exports = hotelsRouter; // Export the router object
