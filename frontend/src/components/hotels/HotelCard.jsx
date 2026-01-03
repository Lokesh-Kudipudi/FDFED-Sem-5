import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

export default function HotelCard({ hotel, dark = false }) {
  const navigate = useNavigate();
  // normalize incoming hotel shape to fields this component expects
  const images = useMemo(() => {
    // prefer `images` array
    if (Array.isArray(hotel?.images) && hotel.images.length)
      return hotel.images;
    // fallback to mainImage
    if (hotel?.mainImage) return [hotel.mainImage];
    // fallback to photos
    if (Array.isArray(hotel?.photos) && hotel.photos.length)
      return hotel.photos;
    // roomType may contain an image for first room
    if (
      Array.isArray(hotel?.roomType) &&
      hotel.roomType[0]?.image
    )
      return [hotel.roomType[0].image];
    return [];
  }, [hotel]);

  const [idx, setIdx] = useState(0);

  const go = (dir) => {
    if (!images.length) return;
    setIdx((i) => (i + dir + images.length) % images.length);
  };

  return (
    <div
      className={`group rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "bg-transparent text-white"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Image carousel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {images?.length ? (
          <>
            <img
              src={images[idx]}
              alt={hotel?.name || "Hotel image"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Navigation Arrows - Only show on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 text-gray-800 font-bold hover:bg-white flex items-center justify-center shadow-md"
                >
                ‹
                </button>
                <button
                onClick={(e) => { e.stopPropagation(); go(1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 text-gray-800 font-bold hover:bg-white flex items-center justify-center shadow-md"
                >
                ›
                </button>
            </div>
            
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-full">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      i === idx
                        ? "bg-white w-3"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div
            className={`h-full w-full ${
              dark ? "bg-white/10" : "bg-gray-100"
            }`}
          />
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            {hotel?.discount && (
            <span className="text-xs font-bold rounded-lg px-3 py-1 bg-rose-600 text-white shadow-lg">
                {hotel.discount} OFF
            </span>
            )}
            {hotel?.rating && hotel.rating >= 4.5 && (
                <span className="text-xs font-bold rounded-lg px-2 py-1 bg-[#003366] text-white shadow-lg flex items-center gap-1">
                 <FaStar size={10} className="text-yellow-400" /> Top Rated
                </span>
            )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex justify-between items-start">
            <h4
            className={`text-lg font-bold truncate flex-1 ${
                dark
                ? "text-white hover:text-blue-200"
                : "text-[#003366] group-hover:text-blue-700"
            } cursor-pointer transition-colors`}
            onClick={() => {
                const id = hotel?._id || hotel?.id;
                navigate(id ? `/hotels/hotel/${id}` : "/hotels/search");
            }}
            title={hotel?.title || hotel?.name}
            >
            {hotel?.title || hotel?.name || "Hotel"}
            </h4>
             {/* Rating Badge */}
            {(hotel?.rating || hotel?.score) && (
                <div className={`flex items-center justify-center text-xs font-bold h-7 min-w-[30px] px-1 rounded-md ${dark ? 'bg-green-600 text-white' : 'bg-[#003366] text-white'}`}>
                    {hotel.rating ?? hotel.score}
                </div>
            )}
        </div>
        
        <p className={`mt-1 text-sm flex items-center gap-1 ${dark ? "text-white/80" : "text-gray-500"}`}>
           <FaMapMarkerAlt size={12} className="text-blue-500" />
           {hotel?.city || hotel?.location || hotel?.address || "—"}
        </p>

        {/* Amenities Preview */}
        {hotel?.amenities && (
            <div className="mt-3 flex gap-2 overflow-hidden">
                {hotel.amenities.slice(0, 3).map((am, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {am}
                    </span>
                ))}
                {hotel.amenities.length > 3 && (
                    <span className="text-[10px] text-gray-400 self-center">+{hotel.amenities.length - 3}</span>
                )}
            </div>
        )}

        {/* Price */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
            <div>
               <p className="text-xs text-gray-400">Starting from</p>
               {(() => {
                const priceRaw = hotel?.price ?? hotel?.nightPrice ?? (Array.isArray(hotel?.roomType) && hotel.roomType[0]?.price) ?? null;
                let priceNum = null;
                if (typeof priceRaw === "number") priceNum = priceRaw;
                else if (typeof priceRaw === "string") {
                    const s = priceRaw.replace(/[^0-9.]/g, "");
                    const n = Number(s);
                    priceNum = Number.isFinite(n) ? n : null;
                }

                if (!priceNum) return <span className="text-sm text-gray-400">Check availability</span>;

                return (
                    <div className={`text-xl font-bold ${dark ? "text-white" : "text-[#003366]"}`}>
                        ₹{priceNum.toLocaleString()}
                        <span className={`text-xs font-normal ml-1 ${dark ? "text-white/70" : "text-gray-500"}`}>/ night</span>
                    </div>
                );
               })()}
            </div>
            
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    const id = hotel?._id || hotel?.id;
                    navigate(id ? `/hotels/hotel/${id}` : "/hotels/search");
                }}
                className="text-sm font-bold text-[#003366] hover:text-blue-800 hover:underline decoration-2 underline-offset-4 transition-all"
            >
                View Details
            </button>
        </div>
      </div>
    </div>
  );
}
