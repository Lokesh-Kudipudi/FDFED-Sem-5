const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const { performance } = require("perf_hooks");

const {
  getOverviewAnalytics,
  getHotelAnalytics,
  getTourAnalytics,
  getPerformanceAnalytics,
  getAllBookings,
  getPeopleAnalytics,
} = require("../Controller/ownerAnalyticsController");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const mockReq = {};

const runController = (controller, label, name) => {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const mockRes = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        const end = performance.now();
        const timeMs = (end - start).toFixed(2);
        console.log(`[${label}] ${name} | Time: ${timeMs}ms | Status Code: ${this.statusCode}`);
        resolve();
      }
    };

    try {
      controller(mockReq, mockRes);
    } catch (e) {
      console.error(`Error on ${name}:`, e.message);
      reject(e);
    }
  });
};

async function benchmark() {
  await connectDB();

  const controllers = [
    { name: "getOverviewAnalytics", fn: getOverviewAnalytics },
    { name: "getHotelAnalytics", fn: getHotelAnalytics },
    { name: "getTourAnalytics", fn: getTourAnalytics },
    { name: "getPerformanceAnalytics", fn: getPerformanceAnalytics },
    { name: "getAllBookings", fn: getAllBookings },
    { name: "getPeopleAnalytics", fn: getPeopleAnalytics },
  ];

  console.log("=== First Run (Expected Cache Miss) ===");
  for (const ctrl of controllers) {
    await runController(ctrl.fn, "Miss", ctrl.name);
  }

  console.log("\n=== Second Run (Expected Cache Hit) ===");
  for (const ctrl of controllers) {
    await runController(ctrl.fn, " Hit", ctrl.name);
  }

  console.log("\nFinished benchmarking. Exiting...");
  process.exit(0);
}

benchmark();
