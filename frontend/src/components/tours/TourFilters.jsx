import { useState } from "react";
import { FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";

const TourFilters = ({
  onFilterChange,
  activeFilters,
  onClearFilters,
}) => {
  const filterSections = [
    {
      title: "Price Range",
      name: "priceRange",
      options: ["Budget", "Mid-Range", "Luxury"],
    },
    {
      title: "Duration",
      name: "duration",
      options: ["1-3 days", "4-7 days", "8+ days"],
    },
    {
      title: "Theme",
      name: "tags",
      options: ["Adventure", "Cultural", "Wildlife", "Beach", "Spiritual"],
    },
    {
      title: "Language",
      name: "language",
      options: ["English", "Hindi", "French", "Spanish"],
    },
    {
      title: "Start Location",
      name: "startLocation",
      options: [
        "Delhi",
        "Mumbai",
        "Bangalore",
        "Chennai",
        "Kolkata",
        "Hyderabad",
        "Kochi",
        "Jaipur",
      ],
    },
  ];

  const [expandedSections, setExpandedSections] = useState(() =>
    Object.fromEntries(filterSections.map((s) => [s.name, true]))
  );

  const toggleSection = (name) => {
    setExpandedSections((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <aside className="w-full md:w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit sticky top-24 transition-all duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-[#003366] font-bold text-lg flex items-center gap-2">
          <FaFilter className="text-blue-500" /> Filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-500 hover:text-blue-700 font-semibold transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {filterSections.map((section) => (
          <div key={section.name} className="border-b border-gray-100 pb-4 last:border-0">
            <button
              onClick={() => toggleSection(section.name)}
              className="flex justify-between items-center w-full text-left mb-3 group"
            >
              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {section.title}
              </h4>
              <span className="text-gray-400 text-xs">
                {expandedSections[section.name] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>

            <div
              className={`space-y-2 transition-all duration-300 ease-in-out overflow-hidden ${
                expandedSections[section.name] ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {section.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      value={option}
                      className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400 focus:ring-1 focus:ring-blue-200"
                      onChange={(e) =>
                        onFilterChange(
                          section.name,
                          option,
                          e.target.checked
                        )
                      }
                      checked={activeFilters[section.name]?.includes(option)}
                    />
                    <svg
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 3.5L3.5 6L9 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm group-hover:text-blue-600 transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default TourFilters;
