import React from 'react';
import { FaList } from "react-icons/fa";

export default function AmenityPolicySection({ isEditing, formData, hotel, onArrayChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-indigo-600">
          <FaList />
          <h3 className="text-lg font-bold text-gray-900">Amenities</h3>
        </div>
        {isEditing ? (
          <div>
            <p className="text-xs text-gray-500 mb-2">Separate by commas</p>
            <textarea
              value={formData.amenities?.join(", ") || ""}
              onChange={(e) => onArrayChange(e, "amenities")}
              rows="6"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hotel.amenities?.map((amenity, index) => (
              <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <FaList />
          <h3 className="text-lg font-bold text-gray-900">Policies</h3>
        </div>
        {isEditing ? (
          <div>
            <p className="text-xs text-gray-500 mb-2">One policy per line</p>
            <textarea
              value={formData.policies?.join("\n") || ""}
              onChange={(e) => onArrayChange(e, "policies")}
              rows="6"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ) : (
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {hotel.policies?.map((policy, index) => (
              <li key={index}>{policy}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
