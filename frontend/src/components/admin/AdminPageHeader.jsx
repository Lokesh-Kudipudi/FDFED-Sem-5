import React from 'react';
import { FaPlus } from 'react-icons/fa';

const AdminPageHeader = ({ title, subtitle, icon, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
      <div>
        <h1 className="text-4xl font-serif font-bold text-[#003366] mb-3 flex items-center gap-3">
          <span className="bg-blue-50 p-2 rounded-xl text-3xl">{icon}</span> {title}
        </h1>
        <p className="text-gray-500 text-lg">{subtitle}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-[#003366] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-900 hover:scale-105 transition-all flex items-center gap-2"
        >
          <FaPlus /> {actionLabel}
        </button>
      )}
    </div>
  );
};

export default AdminPageHeader;
