import { useEffect, useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  // Get query from query string
  const queryParam =
    new URLSearchParams(window.location.search).get("q") || "";

  const [query, setQuery] = useState(queryParam);

  useEffect(() => {
    // Debounce search could be added here if needed, but for now direct update
    // We only trigger explicit search on intent or if logic requires
    if (onSearch && query !== queryParam) {
       // Optional: Auto-search as you type logic is currently handled by parent calling this?
       // Actually parent passed `handleSearch`.
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto mb-8 px-4 sticky top-4 z-40 transition-all duration-300">
      <form 
        onSubmit={handleSubmit}
        className="flex items-center bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/20 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-300 transform hover:scale-[1.01]"
      >
        <div className="pl-4 pr-3 text-blue-600 text-lg">
          <FaMapMarkerAlt />
        </div>
        
        <div className="flex-1">
          <label htmlFor="search-location" className="sr-only">Search Location</label>
          <input
            type="text"
            id="search-location"
            placeholder="Search details like 'Goa', 'Beach', 'Luxury'..."
            value={query}
            className="w-full bg-transparent border-none outline-none text-gray-700 text-base placeholder-gray-400 py-2"
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value); // Real-time search
            }}
          />
        </div>

        <button 
          type="submit"
          className="bg-[#003366] text-white px-6 py-2.5 rounded-full hover:bg-blue-800 transition-colors shadow-md flex items-center gap-2 font-medium text-sm"
        >
          <FaSearch />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
