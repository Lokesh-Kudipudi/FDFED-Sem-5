import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchHeader from "../../components/hotels/SearchHeader";
import SearchSidebar from "../../components/hotels/SearchSidebar";
import SearchResultList from "../../components/hotels/SearchResultList";

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

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.query) {
        setQuery(location.state.query);
      }
      if (location.state.filters) {
        setFilters(prev => ({
          ...prev,
          ...location.state.filters
        }));
      }
    }
  }, [location.state]);

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
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366]"></div>
      </div>
    );

  return (
    <>
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Header />

      <SearchHeader 
        filteredHotelsCount={filteredHotels.length}
        query={query}
        setQuery={setQuery}
        setCurrentPage={setCurrentPage}
      />

      {/* Bottom Section: Independent Scrolling Areas */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex gap-6 px-4 md:px-8 py-6 min-h-0">
          
          <SearchSidebar 
            filters={filters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
          />

          <SearchResultList 
            currentHotels={currentHotels}
            filteredHotelsCount={filteredHotels.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            paginate={paginate}
            clearFilters={clearFilters}
          />
      </div>
    </div>
      <Footer />
      </>
  );
};

export default HotelsSearch;

