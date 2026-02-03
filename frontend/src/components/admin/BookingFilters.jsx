import React from 'react';

const BookingFilters = ({ filter, setFilter }) => {
  return (
    <div className="flex gap-4">
      {["all", "Tour", "Hotel", "Custom Tour"].map(tab => (
        <button
          key={tab}
          onClick={() => setFilter(tab)}
          className={`px-6 py-3 rounded-2xl font-bold transition-all ${
            filter === tab
              ? "bg-[#003366] text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {tab === "all" ? "All Bookings" : `${tab}s`}
        </button>
      ))}
    </div>
  );
};

export default BookingFilters;
