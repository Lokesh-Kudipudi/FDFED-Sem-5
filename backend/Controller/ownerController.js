const { Owner } = require("../Model/ownerModel");

async function getHotelIdsByOwnerId(ownerId) {
  try {
    const owners = await Owner.find({ ownerId }).lean();

    return owners.map((owner) => owner.hotelId._id)[0];
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
    const newOwner = new Owner({ ownerId, hotelId });
    await newOwner.save();
    return newOwner;
  } catch (error) {
    console.error("Error adding hotel ID to owner:", error);
    throw error;
  }
}

module.exports = { getHotelIdsByOwnerId, addHotelIdToOwner };