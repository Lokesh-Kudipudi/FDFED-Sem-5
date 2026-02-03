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
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className={`text-xs px-3 py-1 rounded-full font-bold ${roleColorClass || 'bg-blue-100 text-[#003366]'}`}>
          {roleLabel}
        </span>
      </div>
    </div>
  );
};

export default UserCard;
