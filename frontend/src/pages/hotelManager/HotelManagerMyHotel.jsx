import React, { useState, useEffect } from "react";
import { FaHotel, FaTrash } from "react-icons/fa";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import toast from "react-hot-toast";
import { API } from "../../config/api";

// Components
import HotelHeader from "../../components/hotelmanager/HotelHeader";
import HotelDetails from "../../components/hotelmanager/HotelDetails";
import HotelImages from "../../components/hotelmanager/HotelImages";
import AmenityPolicySection from "../../components/hotelmanager/AmenityPolicySection";
import FeaturesSection from "../../components/hotelmanager/FeaturesSection";
import FaqSection from "../../components/hotelmanager/FaqSection";

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
      const response = await fetch(API.MANAGER.MY_HOTEL, {
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

  const handleFeatureChange = (key, value) => {
    const newFeatures = { ...(formData.features || {}) };
    newFeatures[key] = value.split(",").map(item => item.trim());
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(API.MANAGER.HOTEL, {
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
      const response = await fetch(API.MANAGER.HOTEL, {
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
        <HotelHeader 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
            onSave={handleSave} 
            onDelete={handleDelete}
        />

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
          <HotelDetails 
             isEditing={isEditing}
             formData={formData}
             hotel={hotel}
             onChange={handleInputChange}
          />
          
          {/* Images */}
          <HotelImages
             isEditing={isEditing}
             formData={formData}
             setFormData={setFormData}
             hotel={hotel}
             onChange={handleInputChange}
          />

          {/* Amenities & Policies */}
          <AmenityPolicySection
             isEditing={isEditing}
             formData={formData}
             hotel={hotel}
             onArrayChange={handleArrayChange}
          />

          {/* Features / Accessibility */}
          <FeaturesSection
             isEditing={isEditing}
             formData={formData}
             hotel={hotel}
             onFeatureChange={handleFeatureChange}
          />

          {/* FAQs */}
          <FaqSection
             isEditing={isEditing}
             formData={formData}
             setFormData={setFormData}
             hotel={hotel}
             onFaqChange={handleFaqChange}
          />

        </div>
      </div>
    </DashboardLayout>
  );
}
