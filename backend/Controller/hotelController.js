const { Hotel } = require("../Model/hotelModel");
const { Owner } = require("../Model/ownerModel");

async function getAllHotels() {
  try {
    const hotels = await Hotel.find().lean();
    return {
      status: "success",
      data: hotels,
    };
  } catch (error) {
    throw new Error("Error fetching hotels: " + error.message);
  }
}

async function getHotelById(hotelId) {
  try {
    const hotel = await Hotel.findById(hotelId).lean();
    if (!hotel) {
      throw new Error("Hotel not Found!");
    }

    // Convert features Map to a regular object for JSON serialization
    // Only convert if features is a Map or iterable
    if (
      hotel.features &&
      typeof hotel.features[Symbol.iterator] === "function"
    ) {
      hotel.features = Object.fromEntries(hotel.features);
    }

    return {
      status: "success",
      data: hotel,
    };
  } catch (error) {
    throw new Error("Error fetching Hotel by Id: " + error.message);
  }
}

async function updateHotel(hotelId, hotelData) {
  try {
    // Convert features object to Map
    if (hotelData.features) {
      const featuresMap = new Map();
      Object.entries(hotelData.features).forEach(([key, value]) => {
        featuresMap.set(key, value);
      });
      hotelData.features = featuresMap;
    }

    const hotel = await Hotel.findByIdAndUpdate(hotelId, hotelData, {
      new: true,
    });
    if (!hotel) {
      throw new Error("Hotel not Found!");
    }
    return {
      status: "success",
      message: "Hotel updated successfully",
      data: hotel,
    };
  } catch (error) {
    throw new Error("Error updating hotel: " + error.message);
  }
}

async function addRoomType(hotelId, roomTypeData) {
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    hotel.roomType.push(roomTypeData);
    await hotel.save();

    return {
      status: "success",
      message: "Room type added successfully",
      data: hotel,
    };
  } catch (error) {
    throw new Error("Error adding room type: " + error.message);
  }
}

async function updateRoomType(hotelId, roomId, roomTypeData) {
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    const roomIndex = hotel.roomType.findIndex(
      (room) => room._id.toString() === roomId
    );
    if (roomIndex === -1) {
      throw new Error("Room type not found");
    }

    hotel.roomType[roomIndex] = {
      ...hotel.roomType[roomIndex]._doc,
      ...roomTypeData,
    };
    await hotel.save();

    return {
      status: "success",
      message: "Room type updated successfully",
      data: hotel,
    };
  } catch (error) {
    throw new Error("Error updating room type: " + error.message);
  }
}

async function getRoomTypesByHotelId(hotelId) {
  try {
    const hotel = await Hotel.findById(hotelId).lean();
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    return {
      status: "success",
      data: hotel.roomType,
    };
  } catch (error) {
    throw new Error("Error fetching room types by hotel ID: " + error.message);
  }
}

async function deleteHotel(hotelId) {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { status: "inactive" },
      { new: true }
    );
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    return {
      status: "success",
      message: "Hotel deleted successfully (soft delete)",
      data: hotel,
    };
  } catch (error) {
    throw new Error("Error deleting hotel: " + error.message);
  }
}

async function createHotel(userId, hotelData) {
  try {
    const newHotel = await Hotel.create(hotelData);
    await Owner.create({
      hotelId: newHotel._id,
      ownerId: userId,
    });
    return {
      status: "success",
      data: newHotel,
    };
  } catch (error) {
    throw new Error("Error creating hotel: " + error.message);
  }
}

async function getHotelByOwnerId(userId) {
  try {
    const ownerRecord = await Owner.findOne({ ownerId: userId });
    if (!ownerRecord) {
      return {
        status: "success",
        data: null,
      };
    }
    const hotel = await Hotel.findById(ownerRecord.hotelId);
    return {
      status: "success",
      data: hotel,
    };
  } catch (error) {
    throw new Error("Error fetching hotel by owner ID: " + error.message);
  }
}

module.exports = {
  getAllHotels,
  getHotelById,
  updateHotel,
  addRoomType,
  updateRoomType,
  getRoomTypesByHotelId,
  deleteHotel,
  createHotel,
  getHotelByOwnerId,
};
