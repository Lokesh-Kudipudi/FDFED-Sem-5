import React from 'react';
import { FaSearch } from 'react-icons/fa';

const AdminSearchBar = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder || "Search..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
        />
      </div>
    </div>
  );
};

export default AdminSearchBar;
