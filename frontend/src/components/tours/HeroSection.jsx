import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const HeroSection = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all tours for autocomplete
    fetch("http://localhost:5500/tours/api/tours")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setAllTours(data.data);
        }
      })
      .catch((err) => console.error("Error fetching tours for search:", err));

    // Click outside handler
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = allTours.filter((tour) =>
        tour.title.toLowerCase().includes(value.toLowerCase()) ||
        tour.startLocation.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/tours/search?q=${inputValue}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative w-screen h-[80vh] overflow-hidden flex justify-center items-center">
      <div className="absolute top-0 left-0 w-full h-full">
        <video
          className="w-full h-full object-cover brightness-50"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/tours/toursBg.mp4" type="video/mp4" />
          Your browser does not support video tag
        </video>
      </div>

      <div className="relative z-10 flex justify-center items-center flex-col text-center px-4 w-full max-w-4xl">
        <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg mb-4 animate-fade-in">
          It's Time to Chase Horizons
        </h1>
        <h3 className="text-gray-200 text-lg md:text-xl font-light mb-8 animate-slide-up">
          Let's plan your journey to the unknown.
        </h3>

        <div className="w-full max-w-2xl relative" ref={wrapperRef}>
          <div className="flex items-center bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500/30 transform focus-within:scale-105">
            <div className="pl-4 pr-3 text-blue-600 text-xl">
              <FaMapMarkerAlt />
            </div>
            
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="flex-1 bg-transparent border-none outline-none text-gray-800 text-lg placeholder-gray-400 py-2"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={handleSearch}
              className="bg-[#003366] text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <FaSearch />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden animate-slide-up z-50 text-left border border-white/20">
              <div className="p-2">
                {suggestions.map((tour) => (
                  <div
                    key={tour._id}
                    onClick={() => navigate(`/tours/${tour._id}`)}
                    className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group"
                  >
                    <img
                      src={tour.mainImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                      alt={tour.title}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-[#003366] transition-colors">
                        {tour.title}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-blue-400 text-[10px]" />
                        {tour.startLocation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div 
                className="bg-gray-50 p-2 text-center text-xs text-gray-500 border-t border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleSearch}
              >
                View all results for "{inputValue}"
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
