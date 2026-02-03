import { FaSearch } from "react-icons/fa";

const SearchHeader = ({ 
  filteredHotelsCount, 
  query, 
  setQuery, 
  setCurrentPage 
}) => {
  return (
    <div className="shrink-0 bg-slate-50 z-20 shadow-sm border-b border-gray-200">
      <div className="pt-28 pb-6 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div className="animate-slide-up">
              <h1 className="text-3xl font-bold text-[#003366]">
                Find your perfect stay
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {filteredHotelsCount} properties found
              </p>
           </div>

           {/* Search Bar - Compact & Fixed */}
           <div className="w-full md:w-1/2 lg:w-1/3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white border border-gray-200 shadow-sm rounded-full p-1.5 flex items-center focus-within:ring-2 focus-within:ring-[#003366] transition-all">
                 <div className="pl-4 text-[#003366]">
                   <FaSearch size={16} />
                 </div>
                 <input
                   type="text"
                   placeholder="Search location or hotel..."
                   value={query}
                   onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
                   className="flex-1 bg-transparent border-none outline-none px-3 text-gray-700 placeholder-gray-400 text-sm h-10"
                 />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
