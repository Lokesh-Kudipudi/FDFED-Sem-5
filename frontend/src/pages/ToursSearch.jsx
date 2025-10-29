import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/tours/SearchBar";
import TourFilters from "../components/tours/TourFilters";
import TourList from "../components/tours/TourList";
import useTourFilters from "../hooks/useTourFilters";

const ToursSearch = () => {
  const [tours, setTours] = useState([]);
  const { filteredTours, filters, setFilters, totalPages } =
    useTourFilters(tours);

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
  }, []);

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
    <div>
      <Header />

      <main className="container mx-auto mt-10 px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        <div className="flex gap-8 mt-8">
          <TourFilters
            onFilterChange={handleFilterChange}
            activeFilters={filters}
            onClearFilters={() =>
              setFilters({
                query: "",
                startLocation: [],
                duration: [],
                language: [],
                tags: [],
                priceRange: [],
                availableMonths: [],
                page: 0,
              })
            }
          />

          <div className="flex-1">
            <TourList tours={filteredTours} />

            {/* Pagination */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() =>
                  handlePageChange(filters.page - 1)
                }
                className="px-4 py-2 bg-white rounded shadow hover:bg-gray-50 disabled:opacity-50"
                disabled={filters.page === 0}
              >
                Previous
              </button>
              <span className="py-2">
                Page {filters.page + 1} of {totalPages}
              </span>
              <button
                onClick={() =>
                  handlePageChange(filters.page + 1)
                }
                className="px-4 py-2 bg-white rounded shadow hover:bg-gray-50 disabled:opacity-50"
                disabled={filters.page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToursSearch;
