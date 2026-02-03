import { useState, useEffect, useCallback } from "react";

const useTourFilters = (
  initialTours = [],
  priceRange = [0, 100000],
  minRating = 0,
  favouritesArray = [],
  showFavouritesOnly = false
) => {
  const [filteredTours, setFilteredTours] = useState(initialTours);
  const [filters, setFilters] = useState({
    query: "",
    duration: [],
    page: 0,
  });

  const filterTours = useCallback((tours, currentFilters) => {
    let result = [...tours];

    // Favourites filter (apply first)
    if (showFavouritesOnly) {
      const favouriteIds = favouritesArray.map(fav => 
        typeof fav === 'string' ? fav : fav._id
      );
      result = result.filter(tour => favouriteIds.includes(tour._id));
    }

    // Search query filter
    if (currentFilters.query) {
      result = result.filter((tour) => {
        const searchableText = [
          tour.title,
          ...(tour.itinerary?.flatMap((i) => i.activities) || []),
          ...(tour.destinations?.map((d) => d.name) || []),
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(currentFilters.query.toLowerCase());
      });
    }

    // Duration filter
    if (currentFilters.duration.length > 0) {
      result = result.filter((tour) => {
        const tourDuration = String(tour.duration || "").toLowerCase();
        return currentFilters.duration.some((duration) => {
          if (duration === "1-3 days") {
            return /\b([1-3])\s*(day|night)/i.test(tourDuration);
          }
          if (duration === "4-7 days") {
            return /\b([4-7])\s*(day|night)/i.test(tourDuration);
          }
          if (duration === "8+ days") {
            return /\b([8-9]|[1-9]\d+)\s*(day|night)/i.test(tourDuration);
          }
          return false;
        });
      });
    }

    // Price range filter
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      result = result.filter((tour) => {
        const price = tour.price?.amount || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((tour) => {
        const rating = tour.rating || 0;
        return rating >= minRating;
      });
    }

    // Pagination
    const itemsPerPage = 6;
    const startIndex = currentFilters.page * itemsPerPage;
    return result.slice(startIndex, startIndex + itemsPerPage);
  }, [priceRange, minRating, favouritesArray, showFavouritesOnly]);

  useEffect(() => {
    const filteredResults = filterTours(initialTours, filters);
    setFilteredTours(filteredResults);
  }, [filterTours, filters, initialTours]);

  const getAllFiltered = () => {
    let result = [...initialTours];
    
    // Apply all filters except pagination
    if (showFavouritesOnly) {
      const favouriteIds = favouritesArray.map(fav => 
        typeof fav === 'string' ? fav : fav._id
      );
      result = result.filter(tour => favouriteIds.includes(tour._id));
    }
    
    if (filters.query) {
      result = result.filter((tour) => {
        const searchableText = [
          tour.title,
          ...(tour.itinerary?.flatMap((i) => i.activities) || []),
          ...(tour.destinations?.map((d) => d.name) || []),
        ].join(" ").toLowerCase();
        return searchableText.includes(filters.query.toLowerCase());
      });
    }
    
    if (filters.duration.length > 0) {
      result = result.filter((tour) => {
        const tourDuration = String(tour.duration || "").toLowerCase();
        return filters.duration.some((duration) => {
          if (duration === "1-3 days") return /\b([1-3])\s*(day|night)/i.test(tourDuration);
          if (duration === "4-7 days") return /\b([4-7])\s*(day|night)/i.test(tourDuration);
          if (duration === "8+ days") return /\b([8-9]|[1-9]\d+)\s*(day|night)/i.test(tourDuration);
          return false;
        });
      });
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      result = result.filter((tour) => {
        const price = tour.price?.amount || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }
    
    if (minRating > 0) {
      result = result.filter((tour) => {
        const rating = tour.rating || 0;
        return rating >= minRating;
      });
    }
    
    return result;
  };

  return {
    filteredTours,
    filters,
    setFilters,
    totalPages: Math.ceil(getAllFiltered().length / 6),
  };
};

export default useTourFilters;
