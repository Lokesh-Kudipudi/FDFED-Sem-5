import React from "react";

const TourBookings = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Tour Bookings
      </h2>
      <p className="text-gray-600 mb-4">
        Manage your tour and travel packages.
      </p>
      <div className="bg-white shadow rounded-lg p-4">
        <p>No tours available.</p>
      </div>
    </div>
  );
};

export default TourBookings;
