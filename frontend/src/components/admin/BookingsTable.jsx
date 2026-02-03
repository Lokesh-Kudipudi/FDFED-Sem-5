import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const BookingsTable = ({ bookings, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-bold text-gray-700">Type</th>
              <th className="text-left p-4 text-sm font-bold text-gray-700">Guest</th>
              <th className="text-left p-4 text-sm font-bold text-gray-700">Item</th>
              <th className="text-left p-4 text-sm font-bold text-gray-700">Date</th>
              <th className="text-left p-4 text-sm font-bold text-gray-700">Status</th>
              <th className="text-left p-4 text-sm font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, idx) => (
              <tr
                key={booking._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-slide-up"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                  <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.type === "Hotel" 
                      ? "bg-orange-100 text-orange-600" 
                      : booking.type === "Custom Tour"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {booking.type}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-900">{booking.userId?.fullName || "N/A"}</td>
                <td className="p-4 text-sm text-gray-700">{booking.itemId?.title || "N/A"}</td>
                <td className="p-4 text-sm text-gray-600">{formatDate(booking.createdAt)}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.bookingDetails?.status === "cancel" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}>
                    {booking.bookingDetails?.status || "confirmed"}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onView(booking)}
                    className="text-[#003366] hover:text-blue-900 font-bold text-sm flex items-center gap-1"
                  >
                    <FaInfoCircle /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;
