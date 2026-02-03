import React from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaKey,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaEye,
  FaBan,
} from "react-icons/fa";

const getStatusColor = (status) => {
  const s = status?.toLowerCase() || "";
  if (s === "booked") return { bg: "bg-green-50", text: "text-green-700", icon: FaCheckCircle };
  if (s === "pending") return { bg: "bg-yellow-50", text: "text-yellow-700", icon: FaClock }; // Pending is yellowish
  if (s === "checkedin") return { bg: "bg-blue-50", text: "text-blue-700", icon: FaKey }; // CheckedIn - Key icon
  if (s === "complete" || s === "completed") return { bg: "bg-gray-100", text: "text-gray-700", icon: FaCheckCircle };
  if (s === "cancel" || s === "cancelled") return { bg: "bg-red-50", text: "text-red-700", icon: FaTimesCircle };
  return { bg: "bg-gray-50", text: "text-gray-700", icon: FaClock };
};

export default function BookingCard({ booking, idx, rooms, onAssign, onStatusUpdate, onCancel, onView }) {
  const status = booking.bookingDetails?.status || "Unknown";
  const { bg, text, icon: Icon } = getStatusColor(status);
  const checkIn = booking.bookingDetails?.checkInDate ? new Date(booking.bookingDetails.checkInDate).toLocaleDateString() : "N/A";
  const checkOut = booking.bookingDetails?.checkOutDate ? new Date(booking.bookingDetails.checkOutDate).toLocaleDateString() : "N/A";

  return (
    <div
      className="bg-white rounded-[2rem] p-6 shadow-lg shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group animate-slide-up"
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#0055aa] rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {booking.userId?.fullName?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FaUser size={14} className="text-gray-400" /> {booking.userId?.fullName || "Unknown Guest"}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaEnvelope size={12} className="text-blue-400" /> {booking.userId?.email}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${bg} ${text}`}>
          <Icon size={10} /> {status}
        </span>
      </div>
      
      {booking.assignedRoomId && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mb-3 flex items-center gap-2">
              <div className="bg-white p-1 rounded-md text-[#003366]"><FaKey /></div>
              <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Assigned Room</p>
                  <p className="font-bold text-[#003366] text-sm">Room {rooms.find(r => r._id === booking.assignedRoomId)?.roomNumber || "Unknown"}</p>
              </div>
          </div>
      )}
      
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <FaCalendarAlt /> Check In
            </span>
            <p className="text-sm font-bold text-gray-800 mt-1">{checkIn}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <FaCalendarAlt /> Check Out
            </span>
            <p className="text-sm font-bold text-gray-800 mt-1">{checkOut}</p>
          </div>
        </div>
        
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</span>
          <p className="text-sm font-bold text-green-600 mt-1">₹{booking.bookingDetails?.price?.toLocaleString("en-IN") || 0}</p>
        </div>

        <div className="flex gap-2 pt-3">
          <button
            onClick={() => onView(booking)}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <FaEye /> View
          </button>
          
           {/* PENDING ACTIONS */}
          {status.toLowerCase() === 'pending' && (
               <>
                 <button
                    onClick={() => onStatusUpdate(booking._id, "booked")}
                    className="flex-1 bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <FaCheckCircle /> Confirm
                  </button>
                  <button
                    onClick={() => onCancel(booking._id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2 text-xs"
                  >
                    <FaBan /> Cancel
                  </button>
               </>
          )}

          {/* BOOKED ACTIONS */}
          {status.toLowerCase() === 'booked' && !booking.assignedRoomId && (
              <button
                onClick={() => onAssign(booking)}
                className="flex-1 bg-[#003366] text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <FaKey /> Assign
              </button>
          )}
          
          {status.toLowerCase() === 'booked' && booking.assignedRoomId && (
               <button
                onClick={() => onAssign(booking)}
                className="flex-1 bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-bold hover:bg-blue-200 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <FaKey /> Change
              </button>
          )}

          {status.toLowerCase() === 'booked' && (
            <button
              onClick={() => onCancel(booking._id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2 text-xs"
            >
              <FaBan /> Cancel
            </button>
          )}
          
          {/* CHECKED IN ACTIONS */}
          {status.toLowerCase() === 'checkedin' && (
              <button
                 onClick={() => onStatusUpdate(booking._id, "complete")}
                 className="flex-1 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl font-bold hover:bg-yellow-100 transition-all flex items-center justify-center gap-2 text-xs"
               >
                 Check Out
               </button>
          )}
        </div>
      </div>
    </div>
  );
}
