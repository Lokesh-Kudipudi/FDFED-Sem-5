import React, { useEffect, useMemo, useRef, useState } from "react";
import HotelCarousel from "../components/hotels/HotelCarousel";
import HotelCard from "../components/hotels/HotelCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:5500/hotels/search";

function useHotels(queryParams) {
  const [data, setData] = useState({ hotels: [], loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    const url = new URL(API_BASE);
    Object.entries(queryParams || {}).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      if (Array.isArray(v)) v.forEach((vv) => url.searchParams.append(k, vv));
      else url.searchParams.set(k, v);
    });

    setData((d) => ({ ...d, loading: true, error: null }));
    fetch(url.toString(), { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        // Expecting an array of hotels; normalize to array. Backend may return
        // the array directly or wrap it like { status, data: [...] } or { results: [...] }
        const hotels = Array.isArray(json)
          ? json
          : json?.data || json?.results || json?.hotels || [];
        setData({ hotels, loading: false, error: null });
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setData({ hotels: [], loading: false, error: e.message || "Failed to load" });
      });

    return () => controller.abort();
  }, [JSON.stringify(queryParams)]);

  return data;
}

export default function HotelsPage() {
  // read initial "q" from URL to mirror your original behavior
  const initialQ = useMemo(() => new URLSearchParams(window.location.search).get("q") || "", []);
  const [q, setQ] = useState(initialQ);

  // Optional filters (you can expand these to map real checkboxes)
  const [filters, setFilters] = useState({
    location: [],
    amenities: [],
    beds: [],
    propertyType: [],
  });

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
    let images = Array.isArray(h.images) && h.images.length ? h.images : null;
    if (!images && h.mainImage) images = [h.mainImage];
    if (!images && Array.isArray(h.photos) && h.photos.length) images = h.photos;
    if (!images && Array.isArray(h.roomType) && h.roomType[0]?.image) images = [h.roomType[0].image];
    images = images || [];

    // price: get numeric value from common locations
    const rawPrice = h.price ?? h.nightPrice ?? (Array.isArray(h.roomType) && h.roomType[0]?.price) ?? null;
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

  const normalizedHotels = useMemo(() => (Array.isArray(hotels) ? hotels.map(normalizeHotel) : []), [hotels]);

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const next = params.toString() ? `?${params.toString()}` : "";
    window.history.replaceState({}, "", next);
  };

  // Split fetched hotels into two logical buckets for the two strips
  const topDeals = normalizedHotels.slice(0, 8);
  const uniqueStays = normalizedHotels.slice(8, 16);

  // Static categories (click -> navigates to /hotels/search?... like original)
  const categories = [
    { title: "Villa", img: "/images/hotels/villa.jpg", param: { amenities: "Villa" } },
    { title: "Apartment", img: "/images/hotels/apartment.webp", param: { amenities: "Apartment" } },
    { title: "Spa", img: "/images/hotels/spa.webp", param: { amenities: "Spa" } },
    { title: "Beachfront", img: "https://imgs.search.brave.com/w7nhl1JrKwLy9x8TO5mTEcII-Ch6RraLyFpUMaGOJMg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODM1NzY0MS9waG90/by9iZWFjaGZyb250/LWJ1bmdhbG93LXdp/dGgtc2VhLXZpZXcu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PUl6YnhHRExCWF9C/ay1nQXRoLWJvMkI2/RG9lY1RoTURjT2tT/ZGlHaVhXMHc9", param: { amenities: "BeachFront" } },
    { title: "Cabin", img: "https://imgs.search.brave.com/w7nhl1JrKwLy9x8TO5mTEcII-Ch6RraLyFpUMaGOJMg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODM1NzY0MS9waG90/by9iZWFjaGZyb250/LWJ1bmdhbG93LXdp/dGgtc2VhLXZpZXcu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PUl6YnhHRExCWF9C/ay1nQXRoLWJvMkI2/RG9lY1RoTURjT2tT/ZGlHaVhXMHc9", param: { amenities: "Cabin" } },
    { title: "Mansion", img: "https://imgs.search.brave.com/wDYZzPxMAly1qnw6eQ3qdOKysa1yFNRFRvlO1OgXjvs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/eWVsbG93c3RvbmVu/YXRpb25hbHBhcmts/b2RnZXMuY29tL2Nv/bnRlbnQvdXBsb2Fk/cy8yMDE3LzA0L0xh/a2UtWWVsbG93c3Rv/bmUtSG90ZWwtU3Vu/cm9vbS00LmpwZw", param: { amenities: "Mansion" } },
  ];

  const goToAmenities = (param) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    Object.entries(param).forEach(([k, v]) => url.searchParams.set(k, v));
    window.location.href = url.toString();
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
          <p className="text-gray-200 mt-2">Experience Luxury, Comfort and Adventure.</p>

          <form onSubmit={onSearch} className="mt-6 mx-auto max-w-xl bg-white/95 rounded-full p-2 pl-4 shadow-lg flex items-center gap-3">
            <span className="text-xl">📍</span>
            <div className="flex-1 text-left">
              <label className="text-xs font-semibold text-gray-500 block">Location</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Where are you going?"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <Header />

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 px-6 md:px-10 mt-6">
        Discover your new favourite stay
      </h2>

      {/* Category Carousel (converted from .card1 carousel) */}
      <div className="px-6 md:px-10 mt-6">
        <HotelCarousel
          items={categories.map((c) => ({
            key: c.title,
            content: (
              <button
                onClick={() => goToAmenities(c.param)}
                className="relative w-[280px] h-[200px] rounded-2xl overflow-hidden shadow hover:scale-105 transition"
                title={c.title}
              >
                <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
                <span className="absolute left-3 bottom-3 text-white font-semibold text-lg">
                  {c.title}
                </span>
              </button>
            ),
          }))}
          itemGap="gap-4"
        />
      </div>

      {/* Top deals strip (zebra container) */}
      <section className="relative max-w-6xl mx-auto mt-10 rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("https://forever.travel-assets.com/flex/flexmanager/mediaasset/1191089-0_2-qRvKdMx.jpg?impolicy=fcrop&w=1600&h=700&p=1&q=high")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.75)",
          }}
        />
        <div className="relative z-10 p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Top deals for a last minute getaway</h3>
              <p className="opacity-90 text-sm">Showing deals for: 12 Mar - 14 Mar</p>
            </div>
          </div>

          <div className="mt-6">
            <HotelCarousel
              items={(loading ? Array.from({ length: 6 }).map((_, i) => ({ key: `s${i}`, skeleton: true })) : topDeals).map(
                (hotelOrSkel, idx) => {
                  if (hotelOrSkel?.skeleton) {
                    return {
                      key: hotelOrSkel.key,
                      content: (
                        <div className="w-[280px] bg-white/10 rounded-xl p-3 animate-pulse">
                          <div className="h-36 rounded-lg bg-white/20" />
                          <div className="mt-3 h-4 w-3/4 bg-white/20 rounded" />
                          <div className="mt-2 h-3 w-1/2 bg-white/20 rounded" />
                        </div>
                      ),
                    };
                  }
                  const h = hotelOrSkel;
                  return {
                    key: `${h.id || h._id || idx}`,
                    content: (
                      <div className="w-[280px] rounded-xl overflow-hidden bg-white/10 backdrop-blur-md">
                        <HotelCard hotel={h} dark />
                      </div>
                    ),
                  };
                }
              )}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
