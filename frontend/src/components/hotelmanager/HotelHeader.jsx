import React from 'react';
import { FaEdit, FaSave, FaTrash, FaTimes } from "react-icons/fa";

export default function HotelHeader({ isEditing, setIsEditing, onSave, onDelete }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Hotel</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your property details
        </p>
      </div>
      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition flex items-center gap-2 shadow-sm"
            >
              <FaSave /> Save Changes
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onDelete}
              className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition flex items-center gap-2 border border-red-200"
            >
              <FaTrash /> Delete Hotel
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-2 shadow-sm"
            >
              <FaEdit /> Edit Details
            </button>
          </>
        )}
      </div>
    </div>
  );
}
