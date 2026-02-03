import React from 'react';
import { FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";

export default function BookingFilters({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, dateFilter, setDateFilter }) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search guest, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
        <FaFilter className="text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none font-medium"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="booked">Booked</option>
          <option value="checkedIn">Checked In</option>
          <option value="complete">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
        <FaCalendarAlt className="text-gray-400" />
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none font-medium"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>
  );
}
