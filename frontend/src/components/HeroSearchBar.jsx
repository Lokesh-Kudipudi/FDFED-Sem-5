import React, { useRef, useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const HeroSearchBar = ({
  placeholder = "Where do you want to go?",
  onSearch,
  suggestions = [],
  onInputChange,
  inputValue,
  onSuggestionClick,
  renderSuggestion,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (e) => {
    const value = e.target.value;
    onInputChange(value);
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    onSearch(inputValue);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="w-full max-w-2xl relative" ref={wrapperRef}>
      <div className="flex items-center bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500/30 transform focus-within:scale-105">
        <div className="pl-4 pr-3 text-blue-600 text-xl">
          <FaMapMarkerAlt />
        </div>

        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-gray-800 text-lg placeholder-gray-400 py-2"
          value={inputValue}
          onChange={handleInput}
          onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSearchClick}
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
            {suggestions.map((item, index) => (
              <div
                key={item.id || item._id || index}
                onClick={() => {
                   onSuggestionClick(item);
                   setShowSuggestions(false); 
                }}
                className="cursor-pointer"
              >
                {renderSuggestion ? (
                  renderSuggestion(item)
                ) : (
                  <div className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl transition-colors group">
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-[#003366] transition-colors">
                        {item.title || item.name}
                      </h4>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            className="bg-gray-50 p-2 text-center text-xs text-gray-500 border-t border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleSearchClick}
          >
            View all results for "{inputValue}"
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSearchBar;
