import {
  useEffect,
  useMemo,
  useState,
} from "react";
import HotelCarousel from "../components/hotels/HotelCarousel";
import HotelCard from "../components/hotels/HotelCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSearchBar from "../components/HeroSearchBar"; // Import
import { useNavigate, useLocation } from "react-router";
import { FaMapMarkerAlt } from "react-icons/fa";

const API_BASE = "http://localhost:5500/hotels/search";

function useHotels(queryParams) {
  const [data, setData] = useState({
    hotels: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const url = new URL(API_BASE);
    Object.entries(queryParams || {}).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      if (Array.isArray(v))
        v.forEach((vv) => url.searchParams.append(k, vv));
      else url.searchParams.set(k, v);
    });

    setData((d) => ({ ...d, loading: true, error: null }));
    fetch(url.toString(), { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        const hotels = Array.isArray(json)
          ? json
          : json?.data || json?.results || json?.hotels || [];
        setData({ hotels, loading: false, error: null });
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setData({
          hotels: [],
          loading: false,
          error: e.message || "Failed to load",
        });
      });

    return () => controller.abort();
  }, [JSON.stringify(queryParams)]);

  return data;
}

export default function HotelsPage() {
  const navigate = useNavigate();

  // Search Bar State
  const [allHotelsForSearch, setAllHotelsForSearch] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  // Fetch all hotels for autocomplete once on mount
  useEffect(() => {
    fetch("http://localhost:5500/hotels/search")
        .then(res => res.json())
        .then(data => {
            const list = Array.isArray(data) ? data : data.data || [];
            setAllHotelsForSearch(list);
        })
        .catch(err => console.error("Error fetching hotels for autocomplete", err));
  }, []);

  // Read initial "q" from location state (if navigating back)
  // or default to empty. We prefer state now over URL search params.
  const location = useLocation(); // Make sure to import useLocation from 'react-router'
  const initialQ = location.state?.q || "";
  
  const [q, setQ] = useState(initialQ);
  
  // Sync local search input with q when it changes
  useEffect(() => {
      setSearchInputValue(q);
  }, [q]);

  // Optional filters (you can expand these to map real checkboxes)
  const [filters, setFilters] = useState({
    location: [],
    amenities: [],
    beds: [],
    propertyType: [],
  });

  // We are no longer driving the current page's fetch via URL params for the *search page*,
  // but this page (HotelIndex) just displays "Top Deals" and "Unique Stays".
  // The `useHotels` hook here seems to be fetching *something* based on queryParams,
  // possibly the "Top deals" etc. If `q` is empty, it fetches default list.
  
  const queryParams = useMemo(
    () => ({
      q,
      location: filters.location,
      amenities: filters.amenities,
      beds: filters.beds,
      propertyType: filters.propertyType,
    }),
    [q, filters]
  );

  const { hotels, loading, error } = useHotels(queryParams);

  // Normalize incoming hotel objects (from your mongoose schema) into the shape
  // the UI components expect. This helps when backend uses `title`, `mainImage`,
  // or `roomType` for price.
  const normalizeHotel = (h) => {
    if (!h) return h;
    const id = h._id || h.id || h._id?.$oid || null;
    const name = h.title || h.name || "Hotel";
    const city = h.location || h.city || h.address || null;
    // images: prefer images array, then mainImage, then roomType[0].image
    let images =
      Array.isArray(h.images) && h.images.length
        ? h.images
        : null;
    if (!images && h.mainImage) images = [h.mainImage];
    if (!images && Array.isArray(h.photos) && h.photos.length)
      images = h.photos;
    if (
      !images &&
      Array.isArray(h.roomType) &&
      h.roomType[0]?.image
    )
      images = [h.roomType[0].image];
    images = images || [];

    // price: get numeric value from common locations
    const rawPrice =
      h.price ??
      h.nightPrice ??
      (Array.isArray(h.roomType) && h.roomType[0]?.price) ??
      null;
    let price = null;
    if (typeof rawPrice === "number") price = rawPrice;
    else if (typeof rawPrice === "string") {
      const s = rawPrice.replace(/[^0-9.]/g, "");
      const n = Number(s);
      price = Number.isFinite(n) ? n : null;
    }

    return {
      ...h,
      id,
      name,
      title: name, // keep both
      city,
      images,
      price,
    };
  };

  const normalizedHotels = useMemo(
    () =>
      Array.isArray(hotels) ? hotels.map(normalizeHotel) : [],
    [hotels]
  );



  // Split fetched hotels into two logical buckets for the two strips
  const topDeals = normalizedHotels.slice(0, 8);
  const uniqueStays = normalizedHotels.slice(8, 16);

  // Static categories (click -> navigates to /hotels/search?... like original)
  const categories = [
    {
      title: "Villa",
      img: "/images/hotels/villa.jpg",
      param: { amenities: "Villa" },
    },
    {
      title: "Apartment",
      img: "/images/hotels/apartment.webp",
      param: { amenities: "Apartment" },
    },
    {
      title: "Spa",
      img: "/images/hotels/spa.webp",
      param: { amenities: "Spa" },
    },
    {
      title: "Beachfront",
      img: "https://imgs.search.brave.com/w7nhl1JrKwLy9x8TO5mTEcII-Ch6RraLyFpUMaGOJMg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODM1NzY0MS9waG90/by9iZWFjaGZyb250/LWJ1bmdhbG93LXdp/dGgtc2VhLXZpZXcu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PUl6YnhHRExCWF9C/ay1nQXRoLWJvMkI2/RG9lY1RoTURjT2tT/ZGlHaVhXMHc9",
      param: { amenities: "BeachFront" },
    },
    {
      title: "Cabin",
      img: "https://imgs.search.brave.com/w7nhl1JrKwLy9x8TO5mTEcII-Ch6RraLyFpUMaGOJMg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODM1NzY0MS9waG90/by9iZWFjaGZyb250/LWJ1bmdhbG93LXdp/dGgtc2VhLXZpZXcu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PUl6YnhHRExCWF9C/ay1nQXRoLWJvMkI2/RG9lY1RoTURjT2tT/ZGlHaVhXMHc9",
      param: { amenities: "Cabin" },
    },
    {
      title: "Mansion",
      img: "https://imgs.search.brave.com/wDYZzPxMAly1qnw6eQ3qdOKysa1yFNRFRvlO1OgXjvs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/eWVsbG93c3RvbmVu/YXRpb25hbHBhcmts/b2RnZXMuY29tL2Nv/bnRlbnQvdXBsb2Fk/cy8yMDE3LzA0L0xh/a2UtWWVsbG93c3Rv/bmUtSG90ZWwtU3Vu/cm9vbS00LmpwZw",
      param: { amenities: "Mansion" },
    },
  ];

  const goToAmenities = (param) => {
    // Navigate with state instead of query params
    // Convert param object like { amenities: "Villa" } to filter format expected by HotelsSearch
    // The HotelsSearch expects filters like { accessibility: ... } but here 'amenities' is used.
    // Let's assume we map 'amenities' to 'accessibility' in HotelsSearch or pass it as is
    // if HotelsSearch is updated to handle it.
    // Looking at HotelsSearch: filters.accessibility checks hotel.amenities.
    // So if we pass { accessibility: ["Villa"] } it might work if "Villa" is in amenities.
    // However, the param here is { amenities: "Villa" }.
    // Let's pass it in a generic way in state, and let HotelsSearch handle mapping.
    
    // Note: The previous code did: params.set(k, v) -> /hotels/search?amenities=Villa
    // HotelsSearch didn't seem to parse 'amenities' query param in the initial code I read?
    // Wait, let's re-read HotelsSearch.
    // HotelsSearch only does: const [query, setQuery] = useState(""); and NO query param parsing in useEffect?
    // Ah, Step 20's HotelsSearch.jsx doesn't read query params AT ALL! 
    // That Explains why the user said "search params are not used to filter".
    // So my task is to MAKE IT WORK using state.
    
    // If I send state: { filters: { accessibility: ["Villa"] } }
    
    const filtersToSend = {};
    if (param.amenities) {
        filtersToSend.accessibility = [param.amenities];
    }
    
    navigate("/hotels/search", { state: { filters: filtersToSend } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
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

      <Header />

      {/* Title */}
      {/* "Discover your new favourite stay" section removed as per request */}

      {/* Top deals strip (zebra container) */}
      {/* Top deals strip */}
      <section className="relative max-w-7xl mx-auto mt-12 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage:
                'url("https://forever.travel-assets.com/flex/flexmanager/mediaasset/1191089-0_2-qRvKdMx.jpg?impolicy=fcrop&w=1600&h=700&p=1&q=high")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 p-8 sm:p-12 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                  Top deals for a last minute getaway
                </h3>
                <p className="text-gray-200 text-lg font-medium">
                   Unbeatable prices for your next adventure.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Limited time offer: 12 Mar - 14 Mar
                </p>
              </div>
              <button 
                onClick={() => navigate('/hotels/search')}
                className="px-6 py-2.5 bg-white text-blue-900 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg active:scale-95"
              >
                View All Deals
              </button>
            </div>

            <div className="mt-4">
              <HotelCarousel
                items={(loading
                  ? Array.from({ length: 6 }).map((_, i) => ({
                      key: `s${i}`,
                      skeleton: true,
                    }))
                  : topDeals
                ).map((hotelOrSkel, idx) => {
                  if (hotelOrSkel?.skeleton) {
                    return {
                      key: hotelOrSkel.key,
                      content: (
                        <div className="w-[280px] bg-white/5 rounded-xl p-3 animate-pulse border border-white/10">
                          <div className="h-40 rounded-lg bg-white/10" />
                          <div className="mt-4 h-4 w-3/4 bg-white/10 rounded" />
                          <div className="mt-2 h-3 w-1/2 bg-white/10 rounded" />
                        </div>
                      ),
                    };
                  }
                  const h = hotelOrSkel;
                  return {
                    key: `${h.id || h._id || idx}`,
                    content: (
                      <div className="w-[280px] transform hover:-translate-y-1 transition-transform duration-300">
                         {/* Pass a prop or style to HotelCard if needed, or wrap it */}
                        <div className="rounded-xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors">
                          <HotelCard hotel={h} dark />
                        </div>
                      </div>
                    ),
                  };
                })}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
