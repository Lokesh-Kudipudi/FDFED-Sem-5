// addHotels.js
const mongoose = require("mongoose");
const { Hotel } = require("./Model/hotelModel");
const hotelData = require("./hotels.json");
const dotenv = require("dotenv");
dotenv.config();

const URI = process.env.MONGO_URI; // redact password if sharing

async function run() {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB");

    // if hotelData is an array:
    await Hotel.insertMany(hotelData);
    // if hotelData is a single object: await Hotel.create(hotelData);

    console.log("Hotel data inserted successfully.");
  } catch (err) {
    console.error("Error inserting hotel data:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
