import React, { useState, useEffect } from "react";
import {
  FaHotel,
  FaMapMarkerAlt,
  FaStar,
  FaEdit,
  FaSave,
  FaTrash,
  FaTimes,
  FaImage,
  FaPlus,
  FaMinus,
  FaList,
  FaQuestionCircle,
  FaWheelchair,
} from "react-icons/fa";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import toast from "react-hot-toast";


export default function HotelManagerMyHotel() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchHotelDetails();
  }, []);

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch("http://localhost:5500/dashboard/api/hotelManager/myHotel", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        setHotel(data.data);
        setFormData(data.data);
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    // For amenities and policies, we split by newline or comma
    const arrayValue = field === "amenities" ? value.split(",").map(item => item.trim()) : value.split("\n").filter(item => item.trim() !== "");
    setFormData((prev) => ({ ...prev, [field]: arrayValue }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaq = [...(formData.faq || [])];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setFormData((prev) => ({ ...prev, faq: newFaq }));
  };

  const addFaq = () => {
    setFormData((prev) => ({ ...prev, faq: [...(prev.faq || []), { question: "", answer: "" }] }));
  };

  const removeFaq = (index) => {
    const newFaq = [...(formData.faq || [])];
    newFaq.splice(index, 1);
    setFormData((prev) => ({ ...prev, faq: newFaq }));
  };

  const handleFeatureChange = (key, value) => {
    const newFeatures = { ...(formData.features || {}) };
    newFeatures[key] = value.split(",").map(item => item.trim());
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5500/dashboard/api/hotel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        setHotel(data.data);
        setIsEditing(false);
        toast.success("Hotel updated successfully!");
      } else {
        toast.error(data.message || "Failed to update hotel");
      }
    } catch (error) {
      console.error("Error updating hotel:", error);
      toast.error("Error updating hotel");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your hotel? This action cannot be undone immediately (contact admin to restore)."
      )
    )
      return;

    try {
      const response = await fetch("http://localhost:5500/dashboard/api/hotel", {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Hotel deleted successfully");
        setHotel({ ...hotel, status: "inactive" });
      } else {
        toast.error(data.message || "Failed to delete hotel");
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
      toast.error("Error deleting hotel");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Hotel" sidebarItems={hotelManagerSidebarItems}>
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hotel) {
    return (
      <DashboardLayout title="My Hotel" sidebarItems={hotelManagerSidebarItems}>
        <div className="flex h-full items-center justify-center text-gray-500">
          <div className="text-center">
            <FaHotel size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900">No Hotel Found</h2>
            <p className="text-gray-500 mt-2">
              You haven't linked a hotel yet.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Hotel" sidebarItems={hotelManagerSidebarItems}>
      <div className="p-6">
        {/* Header */}
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
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition flex items-center gap-2 shadow-sm"
                >
                  <FaSave /> Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
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

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Banner */}
          {hotel.status === "inactive" && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
              <FaTrash />
              <span className="font-medium">
                This hotel is currently inactive/deleted. Contact support to restore.
              </span>
            </div>
          )}

          {/* Main Info Card */}
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
                    onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        name="address"
                        placeholder="Full Address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
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

                {/* Rating & Currency */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Details
                  </label>
                  <div className="flex gap-4">
                    {isEditing ? (
                      <>
                        <div className="flex-1">
                          <span className="text-xs text-gray-500 block mb-1">Rating (1-5)</span>
                          <input
                            type="number"
                            name="rating"
                            min="1"
                            max="5"
                            step="0.1"
                            disabled
                            value={formData.rating || ""}
                            onChange={handleInputChange}
                            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed focus:outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs text-gray-500 block mb-1">Currency</span>
                          <input
                            type="text"
                            name="currency"
                            value={formData.currency || ""}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
                          <FaStar className="text-yellow-400" />
                          <span className="font-bold text-gray-900">{hotel.rating}</span>
                        </div>
                        <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                          <span className="text-gray-500 text-sm">Currency: </span>
                          <span className="font-bold text-gray-900">{hotel.currency}</span>
                        </div>
                      </>
                    )}
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
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    {hotel.description}
                  </p>
                )}
              </div>

              {/* Images URL */}
              {isEditing && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Main Image URL
                  </label>
                  <div className="flex gap-2">
                    <div className="bg-gray-50 p-2 rounded border border-gray-300 text-gray-500">
                      <FaImage />
                    </div>
                    <input
                      type="text"
                      name="mainImage"
                      value={formData.mainImage || ""}
                      onChange={handleInputChange}
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities & Policies */}
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
                    onChange={(e) => handleArrayChange(e, "amenities")}
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
                    onChange={(e) => handleArrayChange(e, "policies")}
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

          {/* Features / Accessibility */}
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
                    onChange={(e) => handleFeatureChange("Accessibility", e.target.value)}
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

          {/* FAQs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-yellow-500">
                <FaQuestionCircle />
                <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
              </div>
              {isEditing && (
                <button onClick={addFaq} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
                  <FaPlus /> Add Question
                </button>
              )}
            </div>

            <div className="space-y-4">
              {isEditing ? (
                formData.faq?.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                    <button 
                      onClick={() => removeFaq(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaMinus />
                    </button>
                    <input
                      type="text"
                      placeholder="Question"
                      value={item.question}
                      onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                      className="w-full bg-transparent border-b border-gray-300 mb-2 pb-1 text-gray-900 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                    <textarea
                      placeholder="Answer"
                      value={item.answer}
                      onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                      rows="2"
                      className="w-full bg-transparent text-gray-600 text-sm focus:outline-none"
                    />
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  {hotel.faq?.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                      <h4 className="font-medium text-gray-900 mb-1">{item.question}</h4>
                      <p className="text-gray-600 text-sm">{item.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
