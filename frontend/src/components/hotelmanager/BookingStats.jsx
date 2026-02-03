import React from 'react';

export default function BookingStats({ bookings, filteredBookings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Bookings</div>
        <div className="text-4xl font-bold text-[#003366]">{bookings.length}</div>
      </div>
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Booked</div>
        <div className="text-4xl font-bold text-[#003366]">{bookings.filter(b => b.bookingDetails?.status?.toLowerCase() === 'booked').length}</div>
      </div>
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Checked In</div>
        <div className="text-4xl font-bold text-[#003366]">{bookings.filter(b => b.bookingDetails?.status?.toLowerCase() === 'checkedin').length}</div>
      </div>
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Search Results</div>
        <div className="text-4xl font-bold text-[#003366]">{filteredBookings.length}</div>
      </div>
    </div>
  );
}
