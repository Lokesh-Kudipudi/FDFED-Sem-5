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

// Create a new router object
const toursRouter = express.Router();

// Define route for listing/searching tours
toursRouter.route("/").get(async (req, res) => {
  const searchParam = req.query;

  let currentPage = searchParam?.page;
  let query = searchParam?.q;
  let toursQuery = await getAllTours(); // Fetch all tours

  let toursToDisplay = toursQuery.data; // Extract the data from the query result

  // Set default page to 0 if not provided
  if (currentPage == undefined) {
    currentPage = 0;
  }

  // Filter tours by query if query parameter is provided
  if (query) {
    toursToDisplay = toursToDisplay.filter((tour) => {
      return [
        tour.title,
        ...tour.itinerary.flatMap((i) => i.activities),
        ...tour.destinations.map((d) => d.name),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }

  // Filter by start locations
  const locationsParam = searchParam.startLocation;
  const selectedLocations = Array.isArray(locationsParam)
    ? locationsParam
    : locationsParam
    ? [locationsParam]
    : [];

  if (selectedLocations.length > 0) {
    const set = new Set(
      selectedLocations.map((l) => String(l).toLowerCase())
    );
    toursToDisplay = toursToDisplay.filter((tour) =>
      set.has(String(tour.startLocation || "").toLowerCase())
    );
  }

  // Filter by duration
  const durationsParam = searchParam.duration;
  const selectedDurations = Array.isArray(durationsParam)
    ? durationsParam
    : durationsParam
    ? [durationsParam]
    : [];

  if (selectedDurations.length > 0) {
    toursToDisplay = toursToDisplay.filter((tour) => {
      return selectedDurations.some((selectedDuration) => {
        const duration = String(selectedDuration).toLowerCase();
        const tourDuration = String(
          tour.duration || ""
        ).toLowerCase();

        // Enhanced duration matching
        if (duration.includes("1-3 days")) {
          return /\b([1-3])\s*(day|night)/i.test(tourDuration);
        }
        if (duration.includes("4-7 days")) {
          return /\b([4-7])\s*(day|night)/i.test(tourDuration);
        }
        if (duration.includes("8+ days")) {
          return /\b([8-9]|[1-9]\d+)\s*(day|night)/i.test(
            tourDuration
          );
        }

        // Default exact match
        return tourDuration.includes(duration);
      });
    });
  }

  // Filter by language
  const languagesParam = searchParam.language;
  const selectedLanguages = Array.isArray(languagesParam)
    ? languagesParam
    : languagesParam
    ? [languagesParam]
    : [];

  if (selectedLanguages.length > 0) {
    const set = new Set(
      selectedLanguages.map((l) => String(l).toLowerCase())
    );
    toursToDisplay = toursToDisplay.filter((tour) =>
      set.has(String(tour.language || "").toLowerCase())
    );
  }

  // Filter by tags
  const tagsParam = searchParam.tags;
  const selectedTags = Array.isArray(tagsParam)
    ? tagsParam
    : tagsParam
    ? [tagsParam]
    : [];

  if (selectedTags.length > 0) {
    toursToDisplay = toursToDisplay.filter((tour) => {
      return selectedTags.some((selectedTag) => {
        const tag = String(selectedTag).toLowerCase();
        const tourTags = Array.isArray(tour.tags)
          ? tour.tags.map((t) => String(t).toLowerCase())
          : [];
        const searchableText = [
          ...tourTags,
          tour.description?.toLowerCase() || "",
          ...(tour.includes || []).map((i) =>
            String(i).toLowerCase()
          ),
        ].join(" ");

        // Enhanced tag matching with synonyms
        if (tag.includes("adventure")) {
          return (
            searchableText.includes("adventure") ||
            searchableText.includes("trekking") ||
            searchableText.includes("hiking") ||
            searchableText.includes("climbing")
          );
        }
        if (tag.includes("cultural")) {
          return (
            searchableText.includes("cultural") ||
            searchableText.includes("heritage") ||
            searchableText.includes("historical") ||
            searchableText.includes("traditional")
          );
        }
        if (tag.includes("wildlife")) {
          return (
            searchableText.includes("wildlife") ||
            searchableText.includes("safari") ||
            searchableText.includes("nature") ||
            searchableText.includes("animals")
          );
        }
        if (tag.includes("beach")) {
          return (
            searchableText.includes("beach") ||
            searchableText.includes("coastal") ||
            searchableText.includes("ocean") ||
            searchableText.includes("seaside")
          );
        }
        if (tag.includes("spiritual")) {
          return (
            searchableText.includes("spiritual") ||
            searchableText.includes("religious") ||
            searchableText.includes("temple") ||
            searchableText.includes("pilgrimage")
          );
        }

        // Default exact match
        return searchableText.includes(tag);
      });
    });
  }

  // Filter by price range
  const priceRangeParam = searchParam.priceRange;
  const selectedPriceRanges = Array.isArray(priceRangeParam)
    ? priceRangeParam
    : priceRangeParam
    ? [priceRangeParam]
    : [];

  if (selectedPriceRanges.length > 0) {
    toursToDisplay = toursToDisplay.filter((tour) => {
      const tourPrice = tour.price?.amount || 0;
      return selectedPriceRanges.some((priceRange) => {
        const range = String(priceRange).toLowerCase();

        if (
          range.includes("budget") ||
          range.includes("under-20000")
        ) {
          return tourPrice < 20000;
        }
        if (
          range.includes("mid-range") ||
          range.includes("20000-50000")
        ) {
          return tourPrice >= 20000 && tourPrice <= 50000;
        }
        if (
          range.includes("luxury") ||
          range.includes("above-50000")
        ) {
          return tourPrice > 50000;
        }

        return false;
      });
    });
  }

  // Filter by available months
  const monthsParam = searchParam.availableMonths;
  const selectedMonths = Array.isArray(monthsParam)
    ? monthsParam
    : monthsParam
    ? [monthsParam]
    : [];

  if (selectedMonths.length > 0) {
    toursToDisplay = toursToDisplay.filter((tour) => {
      if (!Array.isArray(tour.availableMonths)) return false;
      return selectedMonths.some((selectedMonth) => {
        const month = String(selectedMonth).toLowerCase();
        return tour.availableMonths.some((availableMonth) =>
          String(availableMonth).toLowerCase().includes(month)
        );
      });
    });
  }

  const numberOfCardsPerPage = 12;
  const numberOfPages = Math.floor(
    (toursToDisplay.length - 1) / numberOfCardsPerPage
  );

  // Paginate the tours to display based on the current page
  toursToDisplay = toursToDisplay.slice(
    currentPage * numberOfCardsPerPage,
    currentPage * numberOfCardsPerPage + numberOfCardsPerPage
  );

  let displayRightButton = true;
  let displayLeftButton = true;

  // Determine if the right navigation button should be displayed
  if (currentPage == numberOfPages) {
    displayRightButton = false;
  }

  // Determine if the left navigation button should be displayed
  if (currentPage == 0) {
    displayLeftButton = false;
  }

  // Return JSON response
  res.json({
    status: "success",
    data: toursToDisplay,
    pagination: {
      page: parseInt(currentPage),
      totalPages: numberOfPages + 1,
      displayLeftButton,
      displayRightButton,
    }
  });
});

toursRouter.route("/destinations").get(async (req, res) => {
  const result = await getTopDestinations();
  res.json(result);
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

const upload = require("../middleware/upload");

// ... (existing imports)

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
