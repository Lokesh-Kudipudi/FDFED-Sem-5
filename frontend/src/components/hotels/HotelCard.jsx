import React, { useMemo, useState } from "react";

/**
 * Expects each hotel like:
 * {
 *   name, city, price, oldPrice, total, rating, reviewsCount, images: [url,...]
 * }
 * Any missing fields will gracefully fallback.
 */
export default function HotelCard({ hotel, dark = false }) {
  // normalize incoming hotel shape to fields this component expects
  const images = useMemo(() => {
    // prefer `images` array
    if (Array.isArray(hotel?.images) && hotel.images.length) return hotel.images;
    // fallback to mainImage
    if (hotel?.mainImage) return [hotel.mainImage];
    // fallback to photos
    if (Array.isArray(hotel?.photos) && hotel.photos.length) return hotel.photos;
    // roomType may contain an image for first room
    if (Array.isArray(hotel?.roomType) && hotel.roomType[0]?.image) return [hotel.roomType[0].image];
    return [];
  }, [hotel]);

  const [idx, setIdx] = useState(0);

  const go = (dir) => {
    if (!images.length) return;
    setIdx((i) => (i + dir + images.length) % images.length);
  };

  return (
    <div
      className={`w-[300px] rounded-2xl overflow-hidden shadow ${dark ? "bg-transparent text-white" : "bg-white text-gray-900"}`}
    >
      {/* Image carousel */}
      <div className="relative h-44 overflow-hidden">
        {images?.length ? (
          <>
            <img
              src={images[idx]}
              alt={hotel?.name || "Hotel image"}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => go(-1)}
              className={`absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full ${dark ? "bg-white/80 text-gray-800" : "bg-white text-gray-800"} font-bold`}
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full ${dark ? "bg-white/80 text-gray-800" : "bg-white text-gray-800"} font-bold`}
            >
              ›
            </button>
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-4 rounded-full ${i === idx ? (dark ? "bg-white" : "bg-gray-800") : "bg-white/60"}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={`h-full w-full ${dark ? "bg-white/10" : "bg-gray-100"}`} />
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h4
          className={`text-lg font-semibold truncate ${dark ? "text-white hover:text-blue-200" : "text-gray-900 hover:text-blue-600"} cursor-pointer`}
          onClick={() => {
            // navigate to hotel detail if _id exists, otherwise fallback to search
            const id = hotel?._id || hotel?.id;
            window.location.href = id ? `/hotels/hotel/${id}` : "/hotels/search";
          }}
          title={hotel?.title || hotel?.name}
        >
          {hotel?.title || hotel?.name || "Hotel"}
        </h4>
        <p className={`${dark ? "text-white/90" : "text-gray-600"} text-sm`}>
          {hotel?.city || hotel?.location || hotel?.address || "—"}
        </p>

        {/* Rating */}
        {(hotel?.rating || hotel?.score) && (
          <div className="mt-1 text-sm flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md font-bold ${dark ? "bg-green-600 text-white" : "bg-green-700 text-white"}`}>
              {hotel.rating ?? hotel.score}
            </span>
            <span className={`${dark ? "text-white" : "text-gray-700"}`}>
              Very good{hotel?.reviewsCount ? ` (${hotel.reviewsCount} reviews)` : ""}
            </span>
          </div>
        )}

        {/* Price */}
        {/* Price: try multiple possible fields and parse numeric value before formatting */}
        {(() => {
          const priceRaw = hotel?.price ?? hotel?.nightPrice ?? (Array.isArray(hotel?.roomType) && hotel.roomType[0]?.price) ?? null;
          let priceNum = null;
          if (typeof priceRaw === "number") priceNum = priceRaw;
          else if (typeof priceRaw === "string") {
            // strip non-digits except dot
            const s = priceRaw.replace(/[^0-9.]/g, "");
            const n = Number(s);
            priceNum = Number.isFinite(n) ? n : null;
          }

          if (!priceNum) return null;

          return (
            <div className="mt-2">
              <div className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                ₹{priceNum.toLocaleString()}
                {hotel?.oldPrice && (
                  <span className="ml-2 text-base font-normal line-through opacity-80">
                    ₹{Number(hotel.oldPrice).toLocaleString()}
                  </span>
                )}
                <span className={`${dark ? "text-white/90" : "text-gray-600"} text-sm ml-1`}> per night</span>
              </div>
              {hotel?.total && (
                <div className={`${dark ? "text-white/90" : "text-gray-600"} text-xs`}>
                  ₹{Number(hotel.total).toLocaleString()} total • includes taxes & fees
                </div>
              )}
            </div>
          );
        })()}

        {/* Optional badges */}
        {hotel?.discount && (
          <span className="inline-block mt-2 text-xs rounded-md px-2 py-1 bg-rose-600 text-white">
            {hotel.discount}
          </span>
        )}
        {hotel?.isMemberDeal && (
          <span className="inline-block mt-2 ml-2 text-xs rounded-md px-2 py-1 bg-purple-700 text-white">
            Member Price available
          </span>
        )}
      </div>
    </div>
  );
}
