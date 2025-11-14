import React from "react";

const Analytics = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Booking Analytics
      </h2>
      <p className="text-gray-600 mb-6">
        Analyze your bookings and travel data.
      </p>
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow text-center">
          <h3 className="text-blue-700 font-semibold">
            Total Bookings
          </h3>
          <p className="text-2xl font-bold mt-2">—</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow text-center">
          <h3 className="text-green-700 font-semibold">
            Completed
          </h3>
          <p className="text-2xl font-bold mt-2">—</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow text-center">
          <h3 className="text-yellow-700 font-semibold">
            Pending
          </h3>
          <p className="text-2xl font-bold mt-2">—</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
