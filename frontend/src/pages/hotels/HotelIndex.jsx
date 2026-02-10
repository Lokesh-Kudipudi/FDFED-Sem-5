import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate, useLocation } from "react-router";
import HotelHeroSearch from "../../components/hotels/HotelHeroSearch";
import HotelDeals from "../../components/hotels/HotelDeals";
import { API } from "../../config/api";

const API_BASE = API.HOTELS.LIST;

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
  }, [queryParams]);

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
    fetch(API.HOTELS.LIST)
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
  
  const [q] = useState(initialQ);
  
  // Sync local search input with q when it changes
  useEffect(() => {
      setSearchInputValue(q);
  }, [q]);

  // Optional filters (you can expand these to map real checkboxes)
  const [filters] = useState({
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

  const { hotels, loading } = useHotels(queryParams);

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
 
  return (
    <div className="min-h-screen bg-gray-50">
      
      <HotelHeroSearch 
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        allHotelsForSearch={allHotelsForSearch}
        setSearchSuggestions={setSearchSuggestions}
        navigate={navigate}
        searchSuggestions={searchSuggestions}
      />

      <Header />

      {/* Title */}
      {/* "Discover your new favourite stay" section removed as per request */}

      <HotelDeals 
        navigate={navigate}
        loading={loading}
        topDeals={topDeals}
      />

      <Footer />
    </div>
  );
}
