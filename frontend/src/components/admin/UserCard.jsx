import React from 'react';
import { FaTrash, FaEnvelope, FaPhone } from 'react-icons/fa';

const UserCard = ({ user, onDelete, roleLabel, roleColorClass, animationDelay }) => {
  return (
    <div
      className="bg-white rounded-[2rem] p-6 shadow-lg shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group animate-slide-up"
      style={{ animationDelay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#0055aa] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {user.fullName?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
            onClick={() => onDelete(user)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-1">{user.fullName}</h3>
      <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
        <FaEnvelope className="text-blue-400" /> {user.email}
      </p>
      {user.phone && (
        <p className="text-sm text-gray-500 flex items-center gap-2 mb-3">
          <FaPhone className="text-blue-400" /> {user.phone}
        </p>
      )}

      {user.assignments && user.assignments.length > 0 && (
        <div className="mt-4 space-y-3 bg-gray-50 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2">Active Assignments</p>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
            {user.assignments.map((asgn) => (
              <div key={`${asgn.type}-${asgn.id}`} className="flex justify-between items-center text-xs">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-700">{asgn.title}</span>
                  <span className={`text-[9px] font-medium uppercase ${asgn.type === 'Hotel' ? 'text-orange-500' : 'text-purple-500'}`}>{asgn.type}</span>
                </div>
                <span className="font-bold text-[#003366]">₹{asgn.revenue?.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-gray-200 mt-1 space-y-1">
            {user.totalHotelRevenue > 0 && (
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-400 font-medium">Hotel Earnings</span>
                <span className="text-orange-600 font-bold">₹{user.totalHotelRevenue.toLocaleString('en-IN')}</span>
              </div>
            )}
            {user.totalTourRevenue > 0 && (
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-400 font-medium">Tour Earnings</span>
                <span className="text-purple-600 font-bold">₹{user.totalTourRevenue.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-500">Total Performance</span>
              <span className="text-sm font-black text-green-600">₹{user.totalRevenue?.toLocaleString('en-IN') || 0}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <span className={`text-xs px-3 py-1 rounded-full font-bold ${roleColorClass || 'bg-blue-100 text-[#003366]'}`}>
          {roleLabel}
        </span>
        {!user.assignments?.length && (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">
            No active assignments
          </span>
        )}
      </div>
    </div>
  );
};

export default UserCard;
