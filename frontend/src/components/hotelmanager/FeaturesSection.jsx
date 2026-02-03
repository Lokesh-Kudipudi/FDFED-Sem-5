import React from 'react';
import { FaWheelchair } from "react-icons/fa";

export default function FeaturesSection({ isEditing, formData, hotel, onFeatureChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-green-600">
        <FaWheelchair />
        <h3 className="text-lg font-bold text-gray-900">Features & Accessibility</h3>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          {/* Accessibility */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Accessibility (Comma separated)
            </label>
            <input
              type="text"
              value={formData.features?.["Accessibility"]?.join(", ") || ""}
              onChange={(e) => onFeatureChange("Accessibility", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Other Features can be added here similarly */}
        </div>
      ) : (
        <div className="space-y-4">
          {hotel.features && Object.entries(hotel.features).map(([key, values]) => (
            <div key={key}>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">{key}</h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(values) && values.map((val, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-50 border border-green-100 rounded text-sm text-green-700">
                    {val}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
