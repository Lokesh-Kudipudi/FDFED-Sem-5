import React from "react";
import {
  FaCalendarCheck,
  FaDollarSign,
  FaUsers,
  FaHotel,
} from "react-icons/fa";

const iconMap = {
  bookings: <FaCalendarCheck className="text-green-500" />,
  revenue: <FaDollarSign className="text-purple-500" />,
  customers: <FaUsers className="text-blue-500" />,
  hotels: <FaHotel className="text-indigo-500" />,
};

export default function StatsCard({ title, value, icon = "bookings" }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl mr-4">
        {iconMap[icon] || iconMap.bookings}
      </div>
      <div>
        <div className="text-xl font-semibold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  );
}