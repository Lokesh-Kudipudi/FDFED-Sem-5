import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/tours/SearchBar";
import TourFilters from "../components/tours/TourFilters";
import TourList from "../components/tours/TourList";
import useTourFilters from "../hooks/useTourFilters";

const ToursSearch = () => {
  const [tours, setTours] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const { filteredTours, filters, setFilters, totalPages } =
    useTourFilters(tours, priceRange, selectedRating, favourites, showFavouritesOnly);

  useEffect(() => {
    // Fetch tours from your API
    const fetchTours = async () => {
      try {
        const response = await fetch(
          "http://localhost:5500/tours/api/tours"
        );
        const data = await response.json();
        setTours(data.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const response = await fetch("http://localhost:5500/api/favourites", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        setFavourites(data.data.map(fav => fav.tourId));
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
  };

  const handleSearch = (query) => {
    setFilters((prev) => ({
      ...prev,
      query,
      page: 0, // Reset to first page on new search
    }));
  };

  const handleFilterChange = (filterType, value, checked) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType] || []), value]
        : prev[filterType].filter((item) => item !== value),
      page: 0, // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto mt-2 px-4 py-8 pt-24">
        
        {/* Page Title Section */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4 tracking-tight">
            Explore Our Tours
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
            Discover the perfect getaway curated just for you. From serene beaches to adventurous mountain treks.
          </p>
        </div>

        {/* Sticky Search Bar */}
        <SearchBar onSearch={handleSearch} />
        
        <div className="flex flex-col lg:flex-row gap-8 mt-8 relative">
          
          {/* Filters Sidebar - Sticky/Fixed */}
          <div className="w-full lg:w-72 shrink-0 animate-slide-in-left opacity-0 fill-mode-forwards" style={{ animationDelay: '200ms' }}>
            <TourFilters
              onFilterChange={handleFilterChange}
              activeFilters={filters}
              onPriceChange={setPriceRange}
              onRatingChange={setSelectedRating}
              onFavouritesToggle={setShowFavouritesOnly}
              priceRange={priceRange}
              selectedRating={selectedRating}
              showFavouritesOnly={showFavouritesOnly}
              onClearFilters={() => {
                setFilters({
                  query: "",
                  duration: [],
                  page: 0,
                });
                setPriceRange([0, 100000]);
                setSelectedRating(0);
                setShowFavouritesOnly(false);
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
             {/* Results Count & Sort (Optional placeholder for now) */}
             <div className="mb-6 flex justify-between items-center text-sm text-gray-500 animate-fade-in">
                <span>Showing {filteredTours.length} results</span>
                {/* <span>Sort by: Recommended ▼</span> */}
             </div>

            <TourList tours={filteredTours} onFavouriteChange={fetchFavourites} />

            {/* Pagination */}
            {filteredTours.length > 0 ? (
              <div className="flex justify-center items-center gap-4 mt-12 animate-fade-in">
                <button
                  onClick={() =>
                    handlePageChange(filters.page - 1)
                  }
                  className="px-6 py-2.5 bg-white border border-gray-200 text-[#003366] rounded-full shadow-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  disabled={filters.page === 0}
                >
                  Previous
                </button>
                <span className="py-2 px-4 bg-white rounded-lg shadow-sm font-medium text-[#003366]">
                  Page {filters.page + 1} <span className="text-gray-400 font-normal">of {totalPages}</span>
                </span>
                <button
                  onClick={() =>
                    handlePageChange(filters.page + 1)
                  }
                  className="px-6 py-2.5 bg-white border border-gray-200 text-[#003366] rounded-full shadow-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  disabled={filters.page >= totalPages - 1}
                >
                  Next
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-sm animate-fade-in text-center p-8">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No tours found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button 
                  onClick={() => {
                    setFilters({
                      query: "",
                      duration: [],
                      page: 0,
                    });
                    setPriceRange([0, 100000]);
                    setSelectedRating(0);
                    setShowFavouritesOnly(false);
                  }}
                  className="mt-6 text-blue-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToursSearch;
