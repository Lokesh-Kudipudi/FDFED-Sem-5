require("dotenv").config();
const mongoose = require("mongoose");
const { getAllTours, getTopDestinations } = require("../Controller/tourController");
const { getAllHotels } = require("../Controller/hotelController");

async function benchmark() {
  console.log("Connecting to Database...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database Connected.\n");

  console.log("--- BENCHMARK START ---");
  
  // 1. Benchmark getAllTours
  console.log("Fetching all tours...");
  let start = Date.now();
  await getAllTours();
  let end = Date.now();
  console.log(`getAllTours: ${end - start} ms`);

  // 2. Benchmark getTopDestinations
  console.log("Fetching top destinations (aggregation)...");
  start = Date.now();
  await getTopDestinations();
  end = Date.now();
  console.log(`getTopDestinations: ${end - start} ms`);

  // 3. Benchmark getAllHotels
  console.log("Fetching all hotels...");
  start = Date.now();
  if (getAllHotels) {
    await getAllHotels();
    end = Date.now();
    console.log(`getAllHotels: ${end - start} ms`);
  } else {
    console.log("getAllHotels function not exported or available directly.");
  }

  console.log("--- BENCHMARK END ---\n");
  mongoose.connection.close();
}

benchmark();
