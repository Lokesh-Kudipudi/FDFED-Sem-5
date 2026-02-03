import React from 'react';
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

export default function HotelDetails({ isEditing, formData, hotel, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="h-48 bg-gray-100 relative">
        <img
          src={formData.mainImage || "https://via.placeholder.com/800x400?text=No+Image"}
          alt="Hotel Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-6 w-full pr-12">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={onChange}
              className="text-3xl font-bold text-white bg-black/30 border border-white/30 rounded px-2 py-1 w-full max-w-md focus:outline-none focus:border-white"
            />
          ) : (
            <h2 className="text-3xl font-bold text-white drop-shadow-md">
              {hotel.title}
            </h2>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Location
            </label>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="location"
                  placeholder="City/Region"
                  value={formData.location || ""}
                  onChange={onChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Full Address"
                  value={formData.address || ""}
                  onChange={onChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 text-gray-600">
                <FaMapMarkerAlt className="mt-1 text-indigo-500" />
                <div>
                  <p className="font-medium text-gray-900">{hotel.location}</p>
                  <p className="text-sm text-gray-500">{hotel.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Rating & Currency & Commission */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Details
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Rating */}
              {isEditing ? (
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Rating (1-5)</span>
                    <input
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      step="0.1"
                      disabled
                      value={formData.rating || ""}
                      onChange={onChange}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed focus:outline-none"
                    />
                  </div>
              ) : (
                  <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span className="font-bold text-gray-900">{hotel.rating}</span>
                  </div>
              )}

                {/* Currency */}
              {isEditing ? (
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Currency</span>
                    <input
                      type="text"
                      name="currency"
                      value={formData.currency || ""}
                      onChange={onChange}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
              ) : (
                  <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    <span className="text-gray-500 text-sm">Currency: </span>
                    <span className="font-bold text-gray-900">{hotel.currency}</span>
                  </div>
              )}
              
              {/* Commission Rate - Always Read Only */}
              <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Commission Rate (%) - Read Only</label>
                  <div className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 cursor-not-allowed">
                    {hotel.commissionRate || 10}%
                  </div>
              </div>

            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Description
          </label>
          {isEditing ? (
            <textarea
              name="description"
              rows="4"
              value={formData.description || ""}
              onChange={onChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {hotel.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
