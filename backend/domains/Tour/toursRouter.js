const express = require("express");
const {
  getTourById,
  getAllTours,
  updateTour,
  deleteTour,
  getTopDestinations,
} = require("./tourController");
const {
  makeTourBooking,
} = require("../Booking/bookingController");
const { authenticateRole } = require("../../middleware/authentication");
const { Tour } = require("./tourModel"); // Assuming the model is named tourModel.js
const upload = require("../../middleware/upload");

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Tour management endpoints
 */

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Get all active tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: List of active tours retrieved successfully
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               mainImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tour created or submitted successfully
 * 
 * /api/tours/destinations:
 *   get:
 *     summary: Get top destinations
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: List of top destinations
 * 
 * /api/tours/book:
 *   post:
 *     summary: Make a tour booking
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               tourId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking created successfully
 * 
 * /api/tours/{id}:
 *   get:
 *     summary: Get tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour details retrieved
 *   put:
 *     summary: Update tour by ID
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour updated successfully
 *   delete:
 *     summary: Delete a tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour deleted successfully
 */
// Create a new router object
const toursRouter = express.Router();

// Define route for listing/searching tours
toursRouter.route("/").get(async (req, res) => {

  let toursQuery = await getAllTours(); // Fetch all tours

  let toursToDisplay = toursQuery.data.filter(
    (tour) => (tour.status || "active").toLowerCase() === "active"
  ); // Extract only approved tours

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
      tourData.status = "pending";
    } else if (!tourData.status) {
      tourData.status = "active";
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

    res.status(201).json({
      status: "success",
      message:
        newTour.status === "pending"
          ? "Tour submitted for admin verification"
          : "Tour created successfully!",
      data: newTour,
    });
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
