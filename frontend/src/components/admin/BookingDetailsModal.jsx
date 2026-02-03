import React from 'react';
import { FaCalendar, FaTimes, FaUser, FaHotel, FaRoute } from "react-icons/fa";

const BookingDetailsModal = ({ selectedBooking, onClose, onCancel }) => {
  if (!selectedBooking) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="bg-[#003366] p-6 flex justify-between items-center text-white sticky top-0">
          <h3 className="font-bold text-xl">Booking Details</h3>
          <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><FaTimes /></button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><FaUser /> Guest Information</h4>
              <p className="text-sm text-gray-600">Name: {selectedBooking.userId?.fullName}</p>
              <p className="text-sm text-gray-600">Email: {selectedBooking.userId?.email}</p>
              <p className="text-sm text-gray-600">Phone: {selectedBooking.userId?.phone || "N/A"}</p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                {selectedBooking.type === "Hotel" ? <FaHotel /> : <FaRoute />} {selectedBooking.type} Details
              </h4>
              <p className="text-sm text-gray-600">Title: {selectedBooking.itemId?.title}</p>
              <p className="text-sm text-gray-600">Location: {selectedBooking.itemId?.location || selectedBooking.itemId?.startLocation}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><FaCalendar /> Booking Information</h4>
            <p className="text-sm text-gray-600">Booking ID: {selectedBooking._id}</p>
            <p className="text-sm text-gray-600">Date: {formatDate(selectedBooking.createdAt)}</p>
            <p className="text-sm text-gray-600">Status: {selectedBooking.bookingDetails?.status || "confirmed"}</p>
            {selectedBooking.bookingDetails?.totalPrice && (
              <p className="text-sm text-gray-600">Total: ₹{selectedBooking.bookingDetails.totalPrice.toLocaleString()}</p>
            )}
          </div>

          {selectedBooking.bookingDetails?.status !== "cancel" && (
            <button
              onClick={() => onCancel(selectedBooking._id)}
              className="w-full bg-red-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
            >
              Cancel This Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
