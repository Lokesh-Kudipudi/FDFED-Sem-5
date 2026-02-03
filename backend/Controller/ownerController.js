const { Hotel } = require("../Model/hotelModel");

async function getHotelIdsByOwnerId(ownerId) {
  try {
    const hotel = await Hotel.findOne({ ownerId }).select('_id').lean();

    if (hotel) {
        return hotel._id;
    }
    return null;
  } catch (error) {
    console.error(
      "Error fetching hotel IDs by owner ID:",
      error
    );
    throw error;
  }
}

async function addHotelIdToOwner(ownerId, hotelId) {
  try {
    const hotel = await Hotel.findByIdAndUpdate(hotelId, { ownerId }, { new: true }).lean();
    if (hotel) {
        // Return object structure compatible with previous Owner model
        return {
            _id: hotel._id, // Using hotel ID as the ID reference
            ownerId: hotel.ownerId,
            hotelId: hotel._id // Explicitly populate hotelId field
        };
    }
    return null;
  } catch (error) {
    console.error("Error adding hotel ID to owner:", error);
    throw error;
  }
}

module.exports = { getHotelIdsByOwnerId, addHotelIdToOwner };