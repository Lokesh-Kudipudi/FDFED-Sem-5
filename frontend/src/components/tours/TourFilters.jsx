import { useState } from "react";

const TourFilters = ({
  onFilterChange,
  activeFilters,
  onClearFilters,
}) => {
  // Keep expanded/collapsed state per section so each section
  // can be shown/hidden independently.

  const filterSections = [
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
      ],
    },
    {
      title: "Duration",
      name: "duration",
      options: ["1-3 days", "4-7 days", "8+ days"],
    },
    // ...add other filter sections similarly
  ];
  const [expandedSections, setExpandedSections] = useState(() =>
    Object.fromEntries(filterSections.map((s) => [s.name, true]))
  );

  return (
    <aside className="bg-gray-50 p-5 rounded-lg shadow-sm w-64 h-max">
      <h3 className="font-semibold border-b pb-2 mb-4">
        Filter by
      </h3>

      {filterSections.map((section) => (
        <div key={section.name} className="mb-4 border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <button
              type="button"
              onClick={() =>
                setExpandedSections((prev) => ({
                  ...prev,
                  [section.name]: !prev[section.name],
                }))
              }
              aria-expanded={!!expandedSections[section.name]}
              className="w-full flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-medium">
                {section.title}
              </span>
              <span
                className={`transform transition-transform ml-3 ${
                  expandedSections[section.name]
                    ? "rotate-180"
                    : ""
                }`}
                aria-hidden
              >
                ▼
              </span>
            </button>
          </div>
          <div className="space-y-2">
            {expandedSections[section.name] &&
              section.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    value={option}
                    onChange={(e) =>
                      onFilterChange(
                        section.name,
                        option,
                        e.target.checked
                      )
                    }
                    checked={activeFilters[
                      section.name
                    ]?.includes(option)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
          </div>
        </div>
      ))}
      <button
        onClick={onClearFilters}
        className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition"
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default TourFilters;
