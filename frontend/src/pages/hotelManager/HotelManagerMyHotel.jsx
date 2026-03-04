import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaEdit, FaHotel, FaMoneyBillWave, FaTrash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import toast from "react-hot-toast";
import { API } from "../../config/api";

import HotelHeader from "../../components/hotelmanager/HotelHeader";
import HotelDetails from "../../components/hotelmanager/HotelDetails";
import HotelImages from "../../components/hotelmanager/HotelImages";
import AmenityPolicySection from "../../components/hotelmanager/AmenityPolicySection";
import FeaturesSection from "../../components/hotelmanager/FeaturesSection";
import FaqSection from "../../components/hotelmanager/FaqSection";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function HotelManagerMyHotel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedHotelId = searchParams.get("hotelId");
  const isEditMode = Boolean(selectedHotelId);

  const [hotels, setHotels] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [hotel, setHotel] = useState(null);
  const [loadingHotel, setLoadingHotel] = useState(isEditMode);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoadingList(true);
        const response = await fetch(API.MANAGER.HOTELS, { credentials: "include" });
        const data = await response.json();
        if (data.status === "success") {
          setHotels(Array.isArray(data.data) ? data.data : []);
        } else {
          toast.error(data.message || "Failed to fetch hotels");
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
        toast.error("Error fetching hotels");
      } finally {
        setLoadingList(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchHotelDetails = async () => {
      try {
        setLoadingHotel(true);
        const url = `${API.MANAGER.HOTEL}?hotelId=${encodeURIComponent(selectedHotelId)}`;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        if (data.status === "success") {
          setHotel(data.data);
          setFormData(data.data);
        } else {
          toast.error(data.message || "Hotel not found");
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        toast.error("Error fetching hotel details");
      } finally {
        setLoadingHotel(false);
      }
    };

    fetchHotelDetails();
  }, [isEditMode, selectedHotelId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    const arrayValue =
      field === "amenities"
        ? value.split(",").map((item) => item.trim())
        : value.split("\n").filter((item) => item.trim() !== "");
    setFormData((prev) => ({ ...prev, [field]: arrayValue }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaq = [...(formData.faq || [])];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setFormData((prev) => ({ ...prev, faq: newFaq }));
  };

  const handleFeatureChange = (key, value) => {
    const newFeatures = { ...(formData.features || {}) };
    newFeatures[key] = value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSave = async () => {
    try {
      const url = `${API.MANAGER.HOTEL}?hotelId=${encodeURIComponent(selectedHotelId)}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
    if (!window.confirm("Are you sure you want to mark this hotel inactive?")) return;

    try {
      const url = `${API.MANAGER.HOTEL}?hotelId=${encodeURIComponent(selectedHotelId)}`;
      const response = await fetch(url, { method: "DELETE", credentials: "include" });
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Hotel deleted successfully");
        setHotel((prev) => ({ ...prev, status: "inactive" }));
      } else {
        toast.error(data.message || "Failed to delete hotel");
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
      toast.error("Error deleting hotel");
    }
  };

  if (!isEditMode) {
    return (
      <DashboardLayout title="My Hotels" sidebarItems={hotelManagerSidebarItems}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#003366]">My Hotels</h1>
            <p className="text-gray-600 mt-1">View revenue and bookings. Edit hotel details here, and room inventory from My Rooms.</p>
          </div>

          {loadingList ? (
            <div className="flex h-[40vh] items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : hotels.length === 0 ? (
            <div className="flex h-[40vh] items-center justify-center text-gray-500">
              <div className="text-center">
                <FaHotel size={48} className="mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">No Hotels Found</h2>
                <p className="text-gray-500 mt-2">You haven't created any hotels yet.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {hotels.map((item) => (
                <div key={item._id} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#003366]">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.location}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {item.status || "active"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <p className="text-xs uppercase text-blue-700 font-semibold">Bookings</p>
                      <p className="text-2xl font-bold text-[#003366]">{item.totalBookings || 0}</p>
                    </div>
                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-xs uppercase text-green-700 font-semibold">Revenue</p>
                      <p className="text-xl font-bold text-[#003366]">{formatCurrency(item.totalRevenue)}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      className="inline-flex items-center gap-2 rounded-lg bg-[#003366] px-4 py-2 text-white hover:bg-[#00264d]"
                      onClick={() => navigate(`/hotel-manager/my-hotels?hotelId=${item._id}`)}
                    >
                      <FaEdit /> Edit Hotel
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => navigate(`/hotel-manager/room-inventory?hotelId=${item._id}`)}
                    >
                      <FaMoneyBillWave /> Edit Rooms
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (loadingHotel) {
    return (
      <DashboardLayout title="Edit Hotel" sidebarItems={hotelManagerSidebarItems}>
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hotel) {
    return (
      <DashboardLayout title="Edit Hotel" sidebarItems={hotelManagerSidebarItems}>
        <div className="p-6">
          <button
            className="mb-4 inline-flex items-center gap-2 text-[#003366] font-semibold"
            onClick={() => navigate("/hotel-manager/my-hotels")}
          >
            <FaArrowLeft /> Back to My Hotels
          </button>
          <div className="text-gray-600">Selected hotel was not found.</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Hotel" sidebarItems={hotelManagerSidebarItems}>
      <div className="p-6">
        <button
          className="mb-4 inline-flex items-center gap-2 text-[#003366] font-semibold"
          onClick={() => navigate("/hotel-manager/my-hotels")}
        >
          <FaArrowLeft /> Back to My Hotels
        </button>

        <HotelHeader isEditing={isEditing} setIsEditing={setIsEditing} onSave={handleSave} onDelete={handleDelete} />

        <div className="max-w-4xl mx-auto space-y-6 mt-4">
          {hotel.status === "inactive" && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
              <FaTrash />
              <span className="font-medium">This hotel is inactive. Contact admin to reactivate.</span>
            </div>
          )}

          <HotelDetails isEditing={isEditing} formData={formData} hotel={hotel} onChange={handleInputChange} />
          <HotelImages isEditing={isEditing} formData={formData} setFormData={setFormData} hotel={hotel} onChange={handleInputChange} />
          <AmenityPolicySection isEditing={isEditing} formData={formData} hotel={hotel} onArrayChange={handleArrayChange} />
          <FeaturesSection isEditing={isEditing} formData={formData} hotel={hotel} onFeatureChange={handleFeatureChange} />
          <FaqSection isEditing={isEditing} formData={formData} setFormData={setFormData} hotel={hotel} onFaqChange={handleFaqChange} />
        </div>
      </div>
    </DashboardLayout>
  );
}
