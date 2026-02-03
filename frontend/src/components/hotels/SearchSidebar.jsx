import { FaFilter } from "react-icons/fa";

const SearchSidebar = ({ 
  filters, 
  toggleFilter, 
  clearFilters 
}) => {
  return (
    <aside className="hidden lg:block w-72 bg-white rounded-2xl shadow-md flex-col h-full overflow-hidden shrink-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 sticky top-0">
         <h3 className="text-lg font-bold text-[#003366] flex items-center gap-2">
           <FaFilter size={14} /> Filters
         </h3>
         <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline font-medium">
           Reset All
         </button>
      </div>
      <div className="p-5 overflow-y-auto h-[calc(100%-60px)] custom-scrollbar">
          {/* Filter Groups */}
          <div className="space-y-6">
            {[
              { title: "Location", key: "location", options: ["Agra", "New Delhi", "Shimla", "Udaipur", "Jaipur", "Rishikesh", "Jaisalmer", "Hyderabad", "Bengaluru", "Coorg", "Kumarakom", "Thekkady", "Pondicherry", "Kodaikanal", "Chennai"] },
              { title: "Price Range", key: "price", options: ["Under ₹5,000", "₹5,000 - ₹10,000", "₹10,000 - ₹20,000", "Above ₹20,000"] },
              { title: "Room Type", key: "roomType", options: ["Deluxe Room", "Palace Room", "Cottage", "View Room"] },
              { title: "Amenities", key: "accessibility", options: ["Free WiFi", "Swimming Pool", "Spa", "Bar", "Fitness Center", "Fine Dining", "Butler Service"] }
            ].map((group) => (
              <div key={group.key}>
                <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">{group.title}</h4>
                <div className="space-y-2">
                    {group.options.map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            className="peer h-4 w-4 appearance-none rounded border border-gray-300 checked:bg-[#003366] checked:border-[#003366] transition-all"
                            checked={filters[group.key].includes(option)}
                            onChange={() => toggleFilter(group.key, option)}
                          />
                          <svg className="absolute w-3 h-3 text-white hidden peer-checked:block left-0.5 top-0.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-[#003366] transition-colors">{option}</span>
                      </label>
                    ))}
                </div>
              </div>
            ))}
          </div>
      </div>
    </aside>
  );
};

export default SearchSidebar;
