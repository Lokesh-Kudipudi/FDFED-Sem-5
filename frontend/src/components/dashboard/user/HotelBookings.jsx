import React from "react";

const HotelBookings = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Hotel Bookings
      </h2>
      <p className="text-gray-600 mb-4">
        View and manage your hotel reservations.
      </p>
      <div className="bg-white shadow rounded-lg p-4">
        <p>No bookings found.</p>
      </div>
    </div>
  );
};

export default HotelBookings;
