import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HotelCard from "./HotelCard";

const SearchResultList = ({ 
  currentHotels, 
  filteredHotelsCount, 
  itemsPerPage, 
  currentPage, 
  paginate, 
  clearFilters 
}) => {
  const totalPages = Math.ceil(filteredHotelsCount / itemsPerPage);

  return (
    <main className="flex-1 h-full overflow-y-auto no-scrollbar scroll-smooth pb-10">
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 pb-20">
         {currentHotels.length > 0 ? (
           currentHotels.map((hotel, index) => (
             <div 
               key={hotel._id} 
               className="animate-slide-up"
               style={{ animationDelay: `${0.1 + index * 0.05}s` }}
             >
               <HotelCard hotel={hotel} />
             </div>
           ))
         ) : (
           <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
              <p className="text-xl">No hotels found matching your criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-[#003366] font-bold hover:underline">
                Clear all filters
              </button>
           </div>
         )}
       </div>

       {/* Pagination Controls */}
       {filteredHotelsCount > itemsPerPage && (
         <div className="flex justify-center items-center mt-8 gap-2 pb-8">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white shadow-md text-[#003366] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <FaChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 rounded-full font-bold shadow-md transition-all ${
                  currentPage === i + 1
                    ? "bg-[#003366] text-white scale-110"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white shadow-md text-[#003366] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <FaChevronRight size={16} />
            </button>
         </div>
       )}
    </main>
  );
};

export default SearchResultList;
