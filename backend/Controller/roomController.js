const { Room } = require("../Model/roomModel");
const { Hotel } = require("../Model/hotelModel");
const { Booking } = require("../Model/bookingModel");

// Create a new room
async function createRoom(hotelId, roomData) {
  try {
    const newRoom = new Room({
      ...roomData,
      hotelId: hotelId,
    });

    const savedRoom = await newRoom.save();

    return {
      status: "success",
      data: savedRoom,
      message: "Room created successfully",
    };
  } catch (error) {
    // Check for duplicate room number error
    if (error.code === 11000) {
      return {
        status: "fail",
        message: "Room number already exists for this hotel",
      };
    }
    return {
      status: "error",
      message: error.message,
    };
  }
}

// Get all rooms for a hotel
async function getRoomsByHotel(hotelId) {
  try {
    const rooms = await Room.find({ hotelId: hotelId })
      .populate("currentBookingId")
      .sort({ roomNumber: 1 }); // Sort by room number

    return {
      status: "success",
      data: rooms,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

// Update a room
async function updateRoom(roomId, updateData) {
  try {
    // Prevent updating critical fields if needed, or validate
    const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRoom) {
      return {
        status: "fail",
        message: "Room not found",
      };
    }

    return {
      status: "success",
      data: updatedRoom,
      message: "Room updated successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

// Delete a room
async function deleteRoom(roomId) {
  try {
     // Check if room has active booking?
     const room = await Room.findById(roomId);
     if (!room) {
         return { status: "fail", message: "Room not found" };
     }
     
     if (room.status === 'occupied' || room.currentBookingId) {
         return { 
             status: "fail", 
             message: "Cannot delete an occupied room. Please unassign or wait for checkout." 
         };
     }

    await Room.findByIdAndDelete(roomId);

    return {
      status: "success",
      message: "Room deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

// Assign room to booking
async function assignRoomToBooking(bookingId, roomId) {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return { status: "fail", message: "Booking not found" };
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return { status: "fail", message: "Room not found" };
    }

    // Check availability
    if (room.status === "occupied" && String(room.currentBookingId) !== String(bookingId)) {
      return { status: "fail", message: "Room is already occupied" };
    }
    
    // Check maintenance
    if (room.status === "maintenance") {
       return { status: "fail", message: "Room is under maintenance" };
    }

    // If booking already has a room, we might need to free the old room
    if (booking.assignedRoomId && String(booking.assignedRoomId) !== String(roomId)) {
        await Room.findByIdAndUpdate(booking.assignedRoomId, {
            status: "available",
            currentBookingId: null
        });
    }

    // Update Room
    room.status = "occupied";
    room.currentBookingId = bookingId;
    await room.save();

    // Update Booking
    booking.assignedRoomId = roomId;
    
    // Also update booking status if it was pending? 
    // Usually assignment means check-in or confirmed. Let's keep status as is or update to confirmed if needed.
    // For now, we assume this is "Check-in" or pre-assignment.
    // If it's a check-in action, we might want to set bookingDetails.status to "active" or similar if you have that state.
    // Based on user request: "Room status becomes Occupied" - done.
    
    // Standardize Booking Status: Assignment usually implies Check-In in this workflow
    if (booking.bookingDetails) {
        booking.bookingDetails.status = "checkedIn"; 
        // Since it's Mixed type, sometimes we need to mark modified if we change deep properties directly
        booking.markModified('bookingDetails'); 
    }

    await booking.save();

    return {
      status: "success",
      message: "Room assigned successfully",
      data: { room, booking }
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
}

module.exports = {
  createRoom,
  getRoomsByHotel,
  updateRoom,
  deleteRoom,
  assignRoomToBooking,
};
