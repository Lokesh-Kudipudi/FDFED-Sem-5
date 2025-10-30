import React from "react";

export default function PopularDestinations({ items = [] }) {
  if (!items.length) {
    return <div className="text-gray-500">No popular destinations yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((r, idx) => {
        const image = r.item?.mainImage || "";
        const title = r.item?.title || "Untitled";
        return (
          <div key={idx} className="rounded-lg overflow-hidden shadow">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>
            <div className="p-3 bg-gradient-to-t from-black/60 to-transparent text-white -mt-10 relative">
              <div className="absolute inset-x-0 -top-10 flex items-end justify-between px-3">
                {/* spacer to make a nice overlay */}
              </div>
              <div className="relative z-10">
                <h4 className="text-md font-medium">{title}</h4>
                <p className="text-sm opacity-90">
                  {r.totalBookings ?? 0} bookings this month
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}