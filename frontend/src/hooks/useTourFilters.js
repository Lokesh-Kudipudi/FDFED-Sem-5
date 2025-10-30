import { useState, useEffect } from "react";

const useTourFilters = (initialTours = []) => {
  const [filteredTours, setFilteredTours] =
    useState(initialTours);
  const [filters, setFilters] = useState({
    query: "",
    startLocation: [],
    duration: [],
    language: [],
    tags: [],
    priceRange: [],
    availableMonths: [],
    page: 0,
  });

  const filterTours = (tours, currentFilters) => {
    let result = [...tours];

    // Search query filter
    if (currentFilters.query) {
      result = result.filter((tour) => {
        const searchableText = [
          tour.title,
          ...(tour.itinerary?.flatMap((i) => i.activities) ||
            []),
          ...(tour.destinations?.map((d) => d.name) || []),
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(
          currentFilters.query.toLowerCase()
        );
      });
    }

    // Location filter
    if (currentFilters.startLocation.length > 0) {
      const locations = new Set(
        currentFilters.startLocation.map((l) => l.toLowerCase())
      );
      result = result.filter((tour) =>
        locations.has(
          String(tour.startLocation || "").toLowerCase()
        )
      );
    }

    // Duration filter
    if (currentFilters.duration.length > 0) {
      result = result.filter((tour) => {
        const tourDuration = String(
          tour.duration || ""
        ).toLowerCase();
        return currentFilters.duration.some((duration) => {
          if (duration === "1-3 days") {
            return /\b([1-3])\s*(day|night)/i.test(tourDuration);
          }
          if (duration === "4-7 days") {
            return /\b([4-7])\s*(day|night)/i.test(tourDuration);
          }
          if (duration === "8+ days") {
            return /\b([8-9]|[1-9]\d+)\s*(day|night)/i.test(
              tourDuration
            );
          }
          return false;
        });
      });
    }

    // Tags filter with enhanced matching
    if (currentFilters.tags.length > 0) {
      result = result.filter((tour) => {
        return currentFilters.tags.some((tag) => {
          const searchableText = [
            ...(tour.tags || []),
            tour.description,
            ...(tour.includes || []),
          ]
            .join(" ")
            .toLowerCase();

          const tagMatchers = {
            adventure: [
              "adventure",
              "trekking",
              "hiking",
              "climbing",
            ],
            cultural: [
              "cultural",
              "heritage",
              "historical",
              "traditional",
            ],
            wildlife: [
              "wildlife",
              "safari",
              "nature",
              "animals",
            ],
            beach: ["beach", "coastal", "ocean", "seaside"],
            spiritual: [
              "spiritual",
              "religious",
              "temple",
              "pilgrimage",
            ],
          };

          return (
            tagMatchers[tag]?.some((keyword) =>
              searchableText.includes(keyword)
            ) || searchableText.includes(tag)
          );
        });
      });
    }

    // Price range filter
    if (currentFilters.priceRange.length > 0) {
      result = result.filter((tour) => {
        const price = tour.price?.amount || 0;
        return currentFilters.priceRange.some((range) => {
          switch (range) {
            case "budget":
              return price < 20000;
            case "mid-range":
              return price >= 20000 && price <= 50000;
            case "luxury":
              return price > 50000;
            default:
              return false;
          }
        });
      });
    }

    // Pagination
    const itemsPerPage = 6;
    const startIndex = currentFilters.page * itemsPerPage;
    return result.slice(startIndex, startIndex + itemsPerPage);
  };

  useEffect(() => {
    const filteredResults = filterTours(initialTours, filters);
    setFilteredTours(filteredResults);
  }, [filters, initialTours]);

  return {
    filteredTours,
    filters,
    setFilters,
    totalPages: Math.ceil(initialTours.length / 6),
  };
};

export default useTourFilters;
