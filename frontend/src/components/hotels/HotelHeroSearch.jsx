import HeroSearchBar from "../../components/HeroSearchBar";
import { FaMapMarkerAlt } from "react-icons/fa";

const HotelHeroSearch = ({ 
  searchInputValue, 
  setSearchInputValue, 
  allHotelsForSearch, 
  setSearchSuggestions, 
  navigate, 
  searchSuggestions 
}) => {
  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center">
      <video
        className="absolute inset-0 h-full w-full object-cover brightness-50"
        autoPlay
        muted
        loop
        playsInline
        src="/videos/hotels/hotelsBg.mp4"
      />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold drop-shadow">
          Let’s plan your stay among the Horizons.
        </h1>
        <p className="text-gray-200 mt-2">
          Experience Luxury, Comfort and Adventure.
        </p>

        <div className="mt-8 flex justify-center">
           <HeroSearchBar
             placeholder="Where makes your heart beat?"
             inputValue={searchInputValue}
             onInputChange={(val) => {
               setSearchInputValue(val);
               if (val.length > 0) {
                   const filtered = allHotelsForSearch.filter(h => 
                       (h.title || h.name || "").toLowerCase().includes(val.toLowerCase()) ||
                       (h.location || h.city || "").toLowerCase().includes(val.toLowerCase())
                   );
                   setSearchSuggestions(filtered.slice(0, 5));
               } else {
                   setSearchSuggestions([]);
               }
             }}

             onSearch={(val) => {
                 if (!val || val.trim() === "") {
                     navigate("/hotels/search");
                     return;
                 }
                 navigate("/hotels/search", { state: { query: val } });
             }}
             suggestions={searchSuggestions}
             onSuggestionClick={(h) => navigate(`/hotels/hotel/${h._id || h.id}`)}
             renderSuggestion={(h) => (
                 <div className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group">
                   <img
                     src={(h.images && h.images[0]) || h.mainImage || "/images/hotels/hotel_placeholder.jpg"}
                     alt={h.title || h.name}
                     className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                   />
                   <div>
                     <h4 className="font-semibold text-gray-800 group-hover:text-[#003366] transition-colors">
                       {h.title || h.name}
                     </h4>
                     <p className="text-xs text-gray-500 flex items-center gap-1">
                       <FaMapMarkerAlt className="text-blue-400 text-[10px]" />
                       {h.location || h.city}
                     </p>
                   </div>
                 </div>
             )}
           />
        </div>
      </div>
    </section>
  );
};

export default HotelHeroSearch;
