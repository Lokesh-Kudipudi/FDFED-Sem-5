const express = require("express");
const {
  getTourById,
  getAllTours,
  updateTour,
  deleteTour,
  getTopDestinations,
} = require("../Controller/tourController");
const {
  makeTourBooking,
} = require("../Controller/bookingController");
const { authenticateRole } = require("../middleware/authentication");
const {Tour} = require("../Model/tourModel"); // Assuming the model is named tourModel.js
const upload = require("../middleware/upload");

// Create a new router object
const toursRouter = express.Router();

// Define route for listing/searching tours
toursRouter.route("/").get(async (req, res) => {

  let toursQuery = await getAllTours(); // Fetch all tours

  let toursToDisplay = toursQuery.data; // Extract the data from the query result

  // Return JSON response
  res.json({
    status: "success",
    data: toursToDisplay,
  });
});

// POST route to handle new tour data
toursRouter.post("/", authenticateRole(["admin", "tourGuide"]), upload.any(), async (req, res) => {
  try {
    let tourData = { ...req.body };
    
    // Parse JSON strings back to objects/arrays
    const jsonFields = ["tags", "availableMonths", "includes", "destinations", "itinerary", "bookingDetails", "price"];
    jsonFields.forEach(field => {
      if (tourData[field] && typeof tourData[field] === "string") {
        try {
          tourData[field] = JSON.parse(tourData[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    if (req.user.role === "tourGuide") {
      tourData.tourGuideId = req.user._id;
    }

    // Handle Files
    if (req.files) {
      // Main Image
      const mainImageFile = req.files.find(f => f.fieldname === "mainImage");
      if (mainImageFile) {
        tourData.mainImage = mainImageFile.path;
      }

      // Destination Images
      // Expecting fieldnames like "destinationImage_0", "destinationImage_1" matching destinations index
      if (tourData.destinations && Array.isArray(tourData.destinations)) {
        req.files.forEach(file => {
          if (file.fieldname.startsWith("destinationImage_")) {
            const index = parseInt(file.fieldname.split("_")[1]);
            if (!isNaN(index) && tourData.destinations[index]) {
              tourData.destinations[index].image = file.path;
            }
          }
        });
      }
    }

    // Create a new tour document
    const newTour = new Tour(tourData);

    // Save the document to the database
    await newTour.save();

    res
      .status(201)
      .json({ message: "Tour created successfully!" });
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(500).json({
      message: "Failed to create tour",
      error: error.message,
    });
  }
});

toursRouter.route("/destinations").get(async (req, res) => {
  const result = await getTopDestinations();
  res.json(result);
});

// Booking

toursRouter.route("/book").post(async (req, res) => {
  const { startDate, endDate, tourId } = req.body; // Extract booking details from the request body

  if (!req.user) {
    return res.json({
      status: "fail",
      message: "User not authenticated",
    });
  } // Redirect to sign-in page if user is not authenticated

  await makeTourBooking(req.user._id, tourId, {
    startDate: startDate,
    endDate: endDate,
    status: "pending",
  });

  res.status(200).json({
    status: "success",
    message: "Booking created successfully",
  });
});


// Define route for displaying a specific tour by ID
toursRouter.route("/:id").get(async (req, res) => {
  const id = req.params.id;
  const toursQuery = await getTourById(id); // Fetch the tour details by ID

  const tour = toursQuery.data; // Extract the data from the query result

  // Render the 'tours/tour' view with the selected tour details
  res.json({
    status: "success",
    tour: tour,
  });
});

// PUT route to update an existing tour by ID
toursRouter.put("/:id", authenticateRole(["admin", "tourGuide"]), upload.any(), async (req, res) => {
  try {
    const tourId = req.params.id;
    let updatedData = { ...req.body };

    // Parse JSON strings
    const jsonFields = ["tags", "availableMonths", "includes", "destinations", "itinerary", "bookingDetails", "price"];
    jsonFields.forEach(field => {
      if (updatedData[field] && typeof updatedData[field] === "string") {
        try {
          updatedData[field] = JSON.parse(updatedData[field]);
        } catch (e) {
             console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    // Handle Files
    if (req.files) {
      // Main Image
      const mainImageFile = req.files.find(f => f.fieldname === "mainImage");
      if (mainImageFile) {
        updatedData.mainImage = mainImageFile.path;
      }

      // Destination Images
      if (updatedData.destinations && Array.isArray(updatedData.destinations)) {
         req.files.forEach(file => {
          if (file.fieldname.startsWith("destinationImage_")) {
            const index = parseInt(file.fieldname.split("_")[1]);
            if (!isNaN(index) && updatedData.destinations[index]) {
              updatedData.destinations[index].image = file.path;
            }
          }
        });
      }
    }

    // Find the tour by ID and update it
    const updatedTour = await updateTour(tourId, updatedData);

    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.status(200).json({
      message: "Tour updated successfully!",
      tour: updatedTour,
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({
      message: "Failed to update tour",
      error: error.message,
    });
  }
});

// DELETE route to remove a tour by ID
toursRouter.delete("/:id", authenticateRole(["admin", "tourGuide"]), async (req, res) => {
  try {
    const tourId = req.params.id;

    // Find the tour by ID and delete it
    const deletedTour = await deleteTour(tourId);

    if (!deletedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res
      .status(200)
      .json({ message: "Tour deleted successfully!" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({
      message: "Failed to delete tour",
      error: error.message,
    });
  }
});

module.exports = toursRouter;
