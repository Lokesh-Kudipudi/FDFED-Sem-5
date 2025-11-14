import React from "react";

const MyTrips = ({ onTripCancel }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Trips</h2>
      <p className="text-gray-600 mb-4">
        Manage and review your trips.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Trip cards — replace with dynamic data */}
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
          <h3 className="font-semibold text-lg">Trip Name</h3>
          <p className="text-sm text-gray-500">
            Status: Confirmed
          </p>
          <button
            onClick={() => onTripCancel(1)}
            className="mt-3 bg-red-600 text-white text-sm px-4 py-1.5 rounded hover:bg-red-700"
          >
            Cancel Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
