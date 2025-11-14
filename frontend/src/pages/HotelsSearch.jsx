import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HotelsSearch = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: [],
    beds: [],
    accessibility: [],
  });
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Fetch hotels from backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(
          "http://localhost:5500/hotels/search"
        );
        const data = await res.json();
        setHotels(data.data || data); // supports { data: [...] } or [...]
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
  };

  // Apply filters locally (you can replace with API filtering if supported)
  const filteredHotels = hotels.filter((hotel) => {
    const matchLocation =
      filters.location.length === 0 ||
      filters.location.includes(hotel.location);
    const matchBed =
      filters.beds.length === 0 ||
      filters.beds.some((b) =>
        hotel.roomType?.some((r) =>
          r.title?.toLowerCase().includes(b.toLowerCase())
        )
      );
    const matchAmenity =
      filters.accessibility.length === 0 ||
      filters.accessibility.some((a) =>
        hotel.amenities?.includes(a)
      );
    const matchQuery =
      query.trim() === "" ||
      hotel.title.toLowerCase().includes(query.toLowerCase());
    return (
      matchLocation && matchBed && matchAmenity && matchQuery
    );
  });

  const handleSearch = () => {
    // Optional: could refetch from API using ?q=
    console.log("Search query:", query);
  };

  const clearFilters = () => {
    setFilters({ location: [], beds: [], accessibility: [] });
  };

  const handleHotelClick = (id) => {
    navigate(`/hotels/hotel/${id}`);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading hotels...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 font-sans pt-32">
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <div className="flex justify-end w-11/12 mx-auto ">
        <div className="flex items-center bg-white shadow-md px-5 py-3 rounded-full w-full max-w-lg">
          <span className="text-xl mr-3">📍</span>
          <div className="flex flex-col flex-1">
            <label
              htmlFor="location"
              className="text-sm font-semibold text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="Where are you going?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none outline-none text-base bg-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="flex gap-6 w-11/12 mx-auto mt-8">
        {/* Sidebar Filters */}
        <aside className="bg-white rounded-xl shadow-md p-5 w-72 h-fit">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">
            Filter by
          </h3>

          {/* Location */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">
              Location
            </h4>
            {[
              "Colorado",
              "South Carolina",
              "Arizona",
              "Florida",
              "New York",
            ].map((loc) => (
              <label
                key={loc}
                className="block text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  checked={filters.location.includes(loc)}
                  onChange={() => toggleFilter("location", loc)}
                  className="mr-2 accent-blue-500"
                />
                {loc}
              </label>
            ))}
          </div>

          {/* Beds */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">
              Bed Type
            </h4>
            {[
              "Twin beds",
              "King-sized bed",
              "Queen-sized bed",
              "Four-poster bed",
            ].map((bed) => (
              <label
                key={bed}
                className="block text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  checked={filters.beds.includes(bed)}
                  onChange={() => toggleFilter("beds", bed)}
                  className="mr-2 accent-blue-500"
                />
                {bed}
              </label>
            ))}
          </div>

          {/* Accessibility */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">
              Accessibility
            </h4>
            {[
              "Private-Kitchen",
              "Private-garden",
              "Fire pit",
              "Spa",
              "Private Mini-bar",
              "Work Station",
            ].map((a) => (
              <label
                key={a}
                className="block text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  checked={filters.accessibility.includes(a)}
                  onChange={() =>
                    toggleFilter("accessibility", a)
                  }
                  className="mr-2 accent-blue-500"
                />
                {a}
              </label>
            ))}
          </div>

          <button
            onClick={() => console.log(filters)}
            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition mb-2"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            Clear Filters
          </button>
        </aside>

        {/* Hotel Cards */}
        <div className="flex flex-col flex-1 gap-5">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div
                key={hotel._id}
                className="flex bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => handleHotelClick(hotel._id)}
              >
                <div className="w-72 h-full">
                  <img
                    src={hotel.mainImage}
                    alt={hotel.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-bold hover:text-blue-600">
                      {hotel.title}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {hotel.location}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {hotel.amenities?.join(" | ")}
                    </p>
                    <p className="text-green-600 font-semibold mt-2">
                      Reserve now, pay later
                    </p>
                    <p className="text-yellow-500 mt-1">
                      {"⭐".repeat(hotel.rating || 0)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-red-600 font-bold text-lg">
                      {hotel.roomType?.[0]?.price}{" "}
                      {hotel.currency}
                      <span className="block text-gray-500 text-xs">
                        Includes taxes & fees
                      </span>
                    </p>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHotelClick(hotel._id);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No hotels found.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotelsSearch;
