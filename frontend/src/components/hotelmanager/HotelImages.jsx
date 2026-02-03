import React from 'react';
import { FaImage, FaTrash, FaPlus } from "react-icons/fa";

export default function HotelImages({ isEditing, formData, setFormData, hotel, onChange }) {
  if (!isEditing && (!hotel.images || hotel.images.length === 0)) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {isEditing ? (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Images Management
            </label>
            
            {/* Main Image */}
            <div className="mb-4">
                <span className="text-xs text-gray-500 block mb-1">Main Image URL</span>
                <div className="flex gap-2">
                <div className="bg-gray-50 p-2 rounded border border-gray-300 text-gray-500">
                    <FaImage />
                </div>
                <input
                    type="text"
                    name="mainImage"
                    value={formData.mainImage || ""}
                    onChange={onChange}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                </div>
            </div>

            {/* Gallery Images */}
            <div>
                <span className="text-xs text-gray-500 block mb-2">Gallery Images</span>
                <div className="space-y-3">
                    {formData.images && formData.images.map((imgUrl, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <div className="bg-gray-50 p-2 rounded border border-gray-300 text-gray-500">
                        <FaImage />
                        </div>
                        <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index] = e.target.value;
                            setFormData(prev => ({...prev, images: newImages}));
                        }}
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button 
                        onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData(prev => ({...prev, images: newImages}));
                        }}
                        className="text-red-500 hover:text-red-700 p-2"
                        >
                        <FaTrash />
                        </button>
                    </div>
                    ))}
                    
                    {/* Add New Image Button */}
                    <button 
                    onClick={() => setFormData(prev => ({ ...prev, images: [...(prev.images || []), ""] }))}
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium mt-2"
                    >
                    <FaPlus /> Add Image
                    </button>
                </div>
            </div>
        </div>
        ) : (
        // View Mode for Images (Gallery)
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Gallery
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hotel.images && hotel.images.length > 0 ? (
                hotel.images.map((img, idx) => (
                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                        View
                        </div>
                    </div>
                ))
                ) : (
                <p className="text-sm text-gray-400 italic">No additional images available.</p>
                )}
            </div>
        </div>
        )}
    </div>
  );
}
