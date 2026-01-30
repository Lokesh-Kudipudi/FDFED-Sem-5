import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import HeroSearchBar from "../HeroSearchBar";

const HeroSection = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allTours, setAllTours] = useState([]);
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
  }, []);

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/tours/search?q=${inputValue}`);
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

        <HeroSearchBar
          placeholder="Where do you want to go?"
          inputValue={inputValue}
          onInputChange={(val) => {
            setInputValue(val); // Update input value
            if (val.length > 0) {
                const filtered = allTours.filter((tour) =>
                    tour.title.toLowerCase().includes(val.toLowerCase()) ||
                    tour.startLocation.toLowerCase().includes(val.toLowerCase())
                );
                setSuggestions(filtered.slice(0, 5));
            } else {
                setSuggestions([]);
            }
          }}
          onSearch={handleSearch}
          suggestions={suggestions}
          onSuggestionClick={(tour) => navigate(`/tours/${tour._id}`)}
          renderSuggestion={(tour) => (
              <div className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group">
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
          )}
        />
      </div>
    </section>
  );
};

export default HeroSection;
