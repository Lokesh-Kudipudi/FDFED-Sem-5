import React from 'react';
import { FaTimesCircle, FaCheckCircle, FaClock, FaKey } from "react-icons/fa";

const getStatusColor = (status) => {
  const s = status?.toLowerCase() || "";
  if (s === "booked") return { bg: "bg-green-50", text: "text-green-700", icon: FaCheckCircle };
  if (s === "pending") return { bg: "bg-yellow-50", text: "text-yellow-700", icon: FaClock };
  if (s === "checkedin") return { bg: "bg-blue-50", text: "text-blue-700", icon: FaKey };
  if (s === "complete" || s === "completed") return { bg: "bg-gray-100", text: "text-gray-700", icon: FaCheckCircle };
  if (s === "cancel" || s === "cancelled") return { bg: "bg-red-50", text: "text-red-700", icon: FaTimesCircle };
  return { bg: "bg-gray-50", text: "text-gray-700", icon: FaClock };
};

export default function BookingDetailsModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="bg-[#003366] p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Booking Details</h2>
          <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
            <FaTimesCircle size={24} />
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guest Information</label>
              <div className="mt-2 bg-gray-50 p-4 rounded-xl">
                <div className="text-gray-900 font-bold">{booking.userId?.fullName}</div>
                <div className="text-gray-500 text-sm mt-1">{booking.userId?.email}</div>
                <div className="text-gray-500 text-sm">{booking.userId?.phone || "No phone"}</div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment Info</label>
              <div className="mt-2 bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">₹{booking.bookingDetails?.price?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reservation Details</label>
              <div className="mt-2 bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Check In</span>
                  <span className="text-gray-900 font-bold">{booking.bookingDetails?.checkInDate ? new Date(booking.bookingDetails.checkInDate).toDateString() : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check Out</span>
                  <span className="text-gray-900 font-bold">{booking.bookingDetails?.checkOutDate ? new Date(booking.bookingDetails.checkOutDate).toDateString() : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Guests</span>
                  <span className="text-gray-900 font-bold">{Array.isArray(booking.bookingDetails?.guests) ? booking.bookingDetails.guests.length : 1}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${getStatusColor(booking.bookingDetails?.status).text} bg-white border-2 border-current`}>
                    {booking.bookingDetails?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
