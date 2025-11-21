const express = require("express"); // Import the express module
const {
  getAllHotels,
  getHotelById,
} = require("../Controller/hotelController");
const {
  makeHotelBooking,
} = require("../Controller/bookingController");

const hotelsRouter = express.Router(); // Create a new router object

// Define a route for the root path of the hotelsRouter
hotelsRouter.route("/").get((req, res) => {
  // Render the "hotels/index" view and pass an object with a name property
  res.render("hotels/index", { user: req.user });
});

hotelsRouter.route("/search").get(async (req, res) => {
  let response = await getAllHotels();

  if (response.status != "success") {
    res.json({
      status: "fail",
      message: response.message,
    });
  }

  let hotelsToDisplay = response.data;

  const searchParam = req.query;

  const query = searchParam?.q;

  if (query) {
    hotelsToDisplay = hotelsToDisplay.filter((hotel) => {
      return [hotel.title, hotel.location, hotel.address]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }

  // locations: support multiple ?location=A&location=B - Done
  const locationsParam = searchParam.location;
  const selectedLocations = Array.isArray(locationsParam)
    ? locationsParam
    : locationsParam
    ? [locationsParam]
    : [];

  if (selectedLocations.length > 0) {
    const set = new Set(
      selectedLocations.map((l) => String(l).toLowerCase())
    );
    hotelsToDisplay = hotelsToDisplay.filter((hotel) =>
      set.has(String(hotel.location || "").toLowerCase())
    );
  }

  // amenities: enhanced matching with synonyms
  const amenitiesParam = searchParam.amenities;
  const selectedAmenities = Array.isArray(amenitiesParam)
    ? amenitiesParam
    : amenitiesParam
    ? [amenitiesParam]
    : [];

  if (selectedAmenities.length > 0) {
    hotelsToDisplay = hotelsToDisplay.filter((hotel) => {
      return selectedAmenities.every((selectedAmenity) => {
        const amenity = String(selectedAmenity).toLowerCase();

        // Get all searchable content for amenities
        const hotelAmenities = Array.isArray(hotel.amenities)
          ? hotel.amenities.map((a) => String(a).toLowerCase())
          : [];
        const allFeatures = [
          ...hotelAmenities,
          hotel.description?.toLowerCase() || "",
        ];
        const searchableText = allFeatures.join(" ");

        // Enhanced matching with synonyms
        if (
          amenity.includes("private-kitchen") ||
          amenity.includes("private kitchen")
        ) {
          return (
            searchableText.includes("kitchen") ||
            searchableText.includes("kitchenette") ||
            searchableText.includes("cooking")
          );
        }

        if (
          amenity.includes("private-garden") ||
          amenity.includes("private garden")
        ) {
          return (
            searchableText.includes("garden") ||
            searchableText.includes("terrace") ||
            searchableText.includes("patio") ||
            searchableText.includes("balcony")
          );
        }

        if (amenity.includes("fire pit")) {
          return (
            searchableText.includes("fire pit") ||
            searchableText.includes("fireplace") ||
            searchableText.includes("bonfire")
          );
        }

        if (
          amenity.includes("private mini-bar") ||
          amenity.includes("mini-bar")
        ) {
          return (
            searchableText.includes("mini-bar") ||
            searchableText.includes("minibar") ||
            searchableText.includes("refreshment") ||
            searchableText.includes("bar")
          );
        }

        if (
          amenity.includes("work station") ||
          amenity.includes("workstation")
        ) {
          return (
            searchableText.includes("work station") ||
            searchableText.includes("workstation") ||
            searchableText.includes("office") ||
            searchableText.includes("desk") ||
            searchableText.includes("business center")
          );
        }

        // Default exact match
        return searchableText.includes(amenity);
      });
    });
  }

  // beds: enhanced matching with better synonyms
  const bedsParam = searchParam.beds;
  const selectedBeds = Array.isArray(bedsParam)
    ? bedsParam
    : bedsParam
    ? [bedsParam]
    : [];
  if (selectedBeds.length > 0) {
    hotelsToDisplay = hotelsToDisplay.filter((hotel) => {
      if (!Array.isArray(hotel.roomType)) return false;
      return hotel.roomType.some((rt) => {
        return selectedBeds.some((selectedBed) => {
          const bed = String(selectedBed).toLowerCase();
          const searchable = [rt.title, ...(rt.features || [])]
            .join(" ")
            .toLowerCase();

          // Enhanced bed matching
          if (
            bed.includes("twin beds") ||
            bed.includes("twin bed")
          ) {
            return (
              searchable.includes("twin") ||
              searchable.includes("single") ||
              searchable.includes("2 beds") ||
              searchable.includes("two beds")
            );
          }

          if (
            bed.includes("king-sized bed") ||
            bed.includes("king bed")
          ) {
            return (
              searchable.includes("king") ||
              searchable.includes("king-size") ||
              searchable.includes("king size")
            );
          }

          if (
            bed.includes("queen-sized bed") ||
            bed.includes("queen bed")
          ) {
            return (
              searchable.includes("queen") ||
              searchable.includes("queen-size") ||
              searchable.includes("queen size")
            );
          }

          if (
            bed.includes("four-poster bed") ||
            bed.includes("four poster")
          ) {
            return (
              searchable.includes("four-poster") ||
              searchable.includes("four poster") ||
              searchable.includes("canopy") ||
              searchable.includes("luxury bed")
            );
          }

          // Handle numeric patterns
          if (bed === "4+") {
            return (
              /\b([4-9]|\d{2,})\b/.test(searchable) ||
              searchable.includes("4+") ||
              searchable.includes("four") ||
              searchable.includes("family") ||
              searchable.includes("large")
            );
          }

          // Default exact match
          return searchable.includes(bed);
        });
      });
    });
  }

  // property type: improved matching logic
  const propertyTypeParam = searchParam.propertyType;
  const selectedPropertyTypes = Array.isArray(propertyTypeParam)
    ? propertyTypeParam
    : propertyTypeParam
    ? [propertyTypeParam]
    : [];
  if (selectedPropertyTypes.length > 0) {
    hotelsToDisplay = hotelsToDisplay.filter((hotel) => {
      return selectedPropertyTypes.some((selectedType) => {
        const type = String(selectedType).toLowerCase();

        // Get searchable content from hotel
        const fromFeatures = hotel.features
          ? Object.values(hotel.features).flat()
          : [];
        const searchable = [
          hotel.title,
          hotel.location,
          hotel.address,
          hotel.description,
          ...(hotel.amenities || []),
          ...(fromFeatures || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        // Enhanced matching logic
        if (
          type.includes("apartment") &&
          (searchable.includes("apartment") ||
            searchable.includes("flat") ||
            searchable.includes("suite"))
        )
          return true;

        if (
          type.includes("villa") &&
          (searchable.includes("villa") ||
            searchable.includes("bungalow") ||
            searchable.includes("mansion"))
        )
          return true;

        if (
          type.includes("camping") &&
          (searchable.includes("camping") ||
            searchable.includes("tent") ||
            searchable.includes("cabin"))
        )
          return true;

        if (
          type.includes("cottage") &&
          (searchable.includes("cottage") ||
            searchable.includes("cabin") ||
            searchable.includes("chalet"))
        )
          return true;

        if (
          type.includes("garden-suite") &&
          (searchable.includes("garden") ||
            searchable.includes("suite"))
        )
          return true;

        if (
          type.includes("ocean-view") &&
          (searchable.includes("ocean") ||
            searchable.includes("sea") ||
            searchable.includes("beach") ||
            searchable.includes("waterfront"))
        )
          return true;

        if (
          type.includes("business-suite") &&
          (searchable.includes("business") ||
            searchable.includes("executive") ||
            searchable.includes("corporate"))
        )
          return true;

        // Default exact match
        return searchable.includes(type);
      });
    });
  }

  // Render the "hotels/index" view and pass an object with a name property
  res.render("hotels/hotels", {
    hotels: hotelsToDisplay,
    user: req.user,
  });
});

hotelsRouter.route("/hotel/:id").get(async (req, res) => {
  const id = req.params.id;

  let response = await getHotelById(id);

  if (response.status != "success") {
    res.json({
      stats: "Fail",
      message: response.message,
    });
  }

  const hotel = response.data;

  // Render the "hotels/index" view and pass an object with a name property
  res.render("hotels/hotel", { hotel, user: req.user });
});

hotelsRouter.route("/booking/:id").post(async (req, res) => {
  const id = req.params.id;

  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated",
    });
  }

  let response = await makeHotelBooking(
    req.user._id,
    id,
    req.body
  );

  if (response.status != "success") {
    res.json({
      stats: "Fail",
      message: response.message,
    });
  } else {
    res.json({
      status: "success",
      message: "Booking successful",
    });
  }
});

module.exports = hotelsRouter; // Export the router object
