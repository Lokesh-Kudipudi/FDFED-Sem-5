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
import HotelManagerSidebar from "../components/dashboard/hotelManger/HotelManagerSidebar";
import toast from "react-hot-toast";


export default function HotelManagerMyHotel() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      <div className="flex h-screen bg-slate-900 items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex h-screen bg-slate-900 items-center justify-center text-white">
        <div className="text-center">
          <FaHotel size={48} className="mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-bold">No Hotel Found</h2>
          <p className="text-slate-400 mt-2">
            You haven't linked a hotel yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-gray-100 font-sans overflow-hidden">
      <HotelManagerSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between z-10">
          <div>
            <h1 className="text-2xl font-bold text-white">My Hotel</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your property details
            </p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition flex items-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <FaSave /> Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition flex items-center gap-2 border border-red-500/50"
                >
                  <FaTrash /> Delete Hotel
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition flex items-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <FaEdit /> Edit Details
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Status Banner */}
            {hotel.status === "inactive" && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg flex items-center gap-3">
                <FaTrash />
                <span className="font-medium">
                  This hotel is currently inactive/deleted. Contact support to restore.
                </span>
              </div>
            )}

            {/* Main Info Card */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
              <div className="h-48 bg-slate-700 relative">
                <img
                  src={formData.mainImage || "https://via.placeholder.com/800x400?text=No+Image"}
                  alt="Hotel Cover"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-4 left-6">
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="text-3xl font-bold text-white bg-slate-900/50 border border-slate-500 rounded px-2 py-1 w-full max-w-md focus:outline-none focus:border-purple-500"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                      {hotel.title}
                    </h2>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
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
                          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          name="address"
                          placeholder="Full Address"
                          value={formData.address || ""}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 text-slate-300">
                        <FaMapMarkerAlt className="mt-1 text-purple-400" />
                        <div>
                          <p className="font-medium text-white">{hotel.location}</p>
                          <p className="text-sm text-slate-400">{hotel.address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rating & Currency */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Details
                    </label>
                    <div className="flex gap-4">
                      {isEditing ? (
                        <>
                          <div className="flex-1">
                            <span className="text-xs text-slate-400 block mb-1">Rating (1-5)</span>
                            <input
                              type="number"
                              name="rating"
                              min="1"
                              max="5"
                              step="0.1"
                              value={formData.rating || ""}
                              onChange={handleInputChange}
                              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>
                          <div className="flex-1">
                            <span className="text-xs text-slate-400 block mb-1">Currency</span>
                            <input
                              type="text"
                              name="currency"
                              value={formData.currency || ""}
                              onChange={handleInputChange}
                              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700/50 flex items-center gap-2">
                            <FaStar className="text-yellow-400" />
                            <span className="font-bold text-white">{hotel.rating}</span>
                          </div>
                          <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700/50">
                            <span className="text-slate-400 text-sm">Currency: </span>
                            <span className="font-bold text-white">{hotel.currency}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  ) : (
                    <p className="text-slate-300 leading-relaxed">
                      {hotel.description}
                    </p>
                  )}
                </div>

                {/* Images URL */}
                {isEditing && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Main Image URL
                    </label>
                    <div className="flex gap-2">
                      <div className="bg-slate-900 p-2 rounded border border-slate-600 text-slate-400">
                        <FaImage />
                      </div>
                      <input
                        type="text"
                        name="mainImage"
                        value={formData.mainImage || ""}
                        onChange={handleInputChange}
                        className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities & Policies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-purple-400">
                  <FaList />
                  <h3 className="text-lg font-bold text-white">Amenities</h3>
                </div>
                {isEditing ? (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Separate by commas</p>
                    <textarea
                      value={formData.amenities?.join(", ") || ""}
                      onChange={(e) => handleArrayChange(e, "amenities")}
                      rows="6"
                      className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities?.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-blue-400">
                  <FaList />
                  <h3 className="text-lg font-bold text-white">Policies</h3>
                </div>
                {isEditing ? (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">One policy per line</p>
                    <textarea
                      value={formData.policies?.join("\n") || ""}
                      onChange={(e) => handleArrayChange(e, "policies")}
                      rows="6"
                      className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                    {hotel.policies?.map((policy, index) => (
                      <li key={index}>{policy}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Features / Accessibility */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-green-400">
                <FaWheelchair />
                <h3 className="text-lg font-bold text-white">Features & Accessibility</h3>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  {/* Accessibility */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Accessibility (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.features?.["Accessibility"]?.join(", ") || ""}
                      onChange={(e) => handleFeatureChange("Accessibility", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  {/* Other Features can be added here similarly */}
                </div>
              ) : (
                <div className="space-y-4">
                  {hotel.features && Object.entries(hotel.features).map(([key, values]) => (
                    <div key={key}>
                      <h4 className="text-sm font-semibold text-slate-400 uppercase mb-2">{key}</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(values) && values.map((val, idx) => (
                          <span key={idx} className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded text-sm text-slate-300">
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
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <FaQuestionCircle />
                  <h3 className="text-lg font-bold text-white">Frequently Asked Questions</h3>
                </div>
                {isEditing && (
                  <button onClick={addFaq} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                    <FaPlus /> Add Question
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  formData.faq?.map((item, index) => (
                    <div key={index} className="bg-slate-900 p-4 rounded-lg border border-slate-700 relative group">
                      <button 
                        onClick={() => removeFaq(index)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="text"
                        placeholder="Question"
                        value={item.question}
                        onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                        className="w-full bg-transparent border-b border-slate-700 mb-2 pb-1 text-white focus:outline-none focus:border-purple-500"
                      />
                      <textarea
                        placeholder="Answer"
                        value={item.answer}
                        onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                        rows="2"
                        className="w-full bg-transparent text-slate-400 text-sm focus:outline-none"
                      />
                    </div>
                  ))
                ) : (
                  <div className="space-y-4">
                    {hotel.faq?.map((item, index) => (
                      <div key={index} className="border-b border-slate-700 pb-4 last:border-0">
                        <h4 className="font-medium text-white mb-1">{item.question}</h4>
                        <p className="text-slate-400 text-sm">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
