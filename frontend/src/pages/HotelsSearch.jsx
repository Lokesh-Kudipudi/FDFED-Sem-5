import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HotelCard from "../components/hotels/HotelCard";
import { FaSearch, FaMapMarkerAlt, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HotelsSearch = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: [],
    roomType: [],
    price: [],
    accessibility: [],
  });
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const navigate = useNavigate();

  // Fetch hotels from backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("http://localhost:5500/hotels/search");
        const data = await res.json();
        setHotels(data.data || data); 
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Toggle filter checkboxes
  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const values = prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: values };
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredHotels = hotels.filter((hotel) => {
    // 1. Location Filter
    const matchLocation =
      filters.location.length === 0 ||
      filters.location.some((loc) => hotel.location?.includes(loc) || hotel.city?.includes(loc));

    // 2. Room Type Filter
    const matchRoomType = 
       filters.roomType.length === 0 ||
       filters.roomType.some((type) => 
          hotel.roomType?.some(r => r.title?.toLowerCase().includes(type.toLowerCase()))
       );

    // 3. Price Filter (Ranges)
    const hotelPrice = hotel.price ?? hotel.nightPrice ?? (hotel.roomType?.[0]?.price) ?? 0;
    const matchPrice = 
      filters.price.length === 0 ||
      filters.price.some(rangeLabel => {
         if (rangeLabel === "Under ₹5,000") return hotelPrice < 5000;
         if (rangeLabel === "₹5,000 - ₹10,000") return hotelPrice >= 5000 && hotelPrice <= 10000;
         if (rangeLabel === "₹10,000 - ₹20,000") return hotelPrice > 10000 && hotelPrice <= 20000;
         if (rangeLabel === "Above ₹20,000") return hotelPrice > 20000;
         return false;
      });

    // 4. Amenities Filter
    const matchAmenity =
      filters.accessibility.length === 0 ||
      filters.accessibility.some((a) =>
        hotel.amenities?.includes(a)
      );

    // 5. Search Query
    const matchQuery =
      query.trim() === "" ||
      hotel.title.toLowerCase().includes(query.toLowerCase()) ||
      hotel.location.toLowerCase().includes(query.toLowerCase());

    return matchLocation && matchRoomType && matchPrice && matchAmenity && matchQuery;
  });

  const clearFilters = () => {
    setFilters({ location: [], roomType: [], price: [], accessibility: [] });
    setCurrentPage(1);
  };

  // Pagination Logic
  const indexOfLastHotel = currentPage * itemsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366]"></div>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Header />

      {/* Top Section: Fixed (Header spacing + Title + Search) */}
      <div className="shrink-0 bg-slate-50 z-20 shadow-sm border-b border-gray-200">
        <div className="pt-28 pb-6 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div className="animate-slide-up">
                <h1 className="text-3xl font-bold text-[#003366]">
                  Find your perfect stay
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {filteredHotels.length} properties found
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

      {/* Bottom Section: Independent Scrolling Areas */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex gap-6 px-4 md:px-8 py-6 min-h-0">
          
          {/* Sidebar - Independent Scroll */}
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

          {/* Main Content - Independent Scroll */}
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
             {filteredHotels.length > itemsPerPage && (
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
      </div>
    </div>
  );
};

export default HotelsSearch;
