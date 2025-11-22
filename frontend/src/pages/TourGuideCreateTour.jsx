import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { tourGuideSidebarItems } from "../components/dashboard/tourGuide/tourGuideSidebarItems";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function TourGuideCreateTour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    startLocation: "",
    language: "",
    price: {
      amount: 0,
      currency: "INR",
      discount: 0,
    },
    mainImage: "",
    tags: "", // Comma separated string for input
    availableMonths: "", // Comma separated string for input
    includes: "", // Comma separated string for input
    destinations: [], // Array of { name: "", image: "" }
    itinerary: [], // Array of { day: "", location: "", activities: "" } (activities as string for input)
    bookingDetails: [], // Array of { startDate, startDay, endDate, endDay, status, discount }
  });

  useEffect(() => {
    if (isEditMode) {
      fetchTourDetails();
    }
  }, [isEditMode]);

  const fetchTourDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5500/tours/tour/${id}`);
      const data = await response.json();
      if (data.status === "success") {
        const tour = data.tour;
        setFormData({
          ...tour,
          tags: tour.tags ? tour.tags.join(", ") : "",
          availableMonths: tour.availableMonths ? tour.availableMonths.join(", ") : "",
          includes: tour.includes ? tour.includes.join(", ") : "",
          destinations: tour.destinations || [],
          itinerary: tour.itinerary ? tour.itinerary.map(item => ({
            ...item,
            activities: item.activities ? item.activities.join(", ") : ""
          })) : [],
          bookingDetails: tour.bookingDetails || [],
        });
      }
    } catch (error) {
      console.error("Error fetching tour details:", error);
      toast.error("Failed to fetch tour details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("price.")) {
      const priceField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        price: {
          ...prev.price,
          [priceField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handlers for Destinations
  const handleAddDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, { name: "", image: "" }]
    }));
  };

  const handleDestinationChange = (index, field, value) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index][field] = value;
    setFormData(prev => ({ ...prev, destinations: newDestinations }));
  };

  const handleRemoveDestination = (index) => {
    const newDestinations = formData.destinations.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, destinations: newDestinations }));
  };

  // Handlers for Itinerary
  const handleAddItineraryItem = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: "", location: "", activities: "" }]
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const handleRemoveItineraryItem = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  // Handlers for Booking Details
  const handleAddBookingDetail = () => {
    setFormData(prev => ({
      ...prev,
      bookingDetails: [...prev.bookingDetails, { 
        startDate: "", startDay: "", endDate: "", endDay: "", status: "Available", discount: 0 
      }]
    }));
  };

  const handleBookingDetailChange = (index, field, value) => {
    const newBookingDetails = [...formData.bookingDetails];
    newBookingDetails[index][field] = value;

    // Auto-fill day if date is changed
    if (field === "startDate" || field === "endDate") {
      if (value) {
        const date = new Date(value);
        const day = date.toLocaleDateString("en-IN", { weekday: "long" });
        const dayField = field === "startDate" ? "startDay" : "endDay";
        newBookingDetails[index][dayField] = day;
      }
    }

    setFormData(prev => ({ ...prev, bookingDetails: newBookingDetails }));
  };

  const handleRemoveBookingDetail = (index) => {
    const newBookingDetails = formData.bookingDetails.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, bookingDetails: newBookingDetails }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.bookingDetails.length === 0) {
      toast.error("Please add at least one booking detail");
      return;
    }

    if (formData.itinerary.length === 0) {
      toast.error("Please add at least one itinerary item");
      return;
    }

    if (formData.destinations.length === 0) {
      toast.error("Please add at least one place to visit");
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      availableMonths: formData.availableMonths.split(",").map((m) => m.trim()).filter(Boolean),
      includes: formData.includes.split(",").map((i) => i.trim()).filter(Boolean),
      itinerary: formData.itinerary.map(item => ({
        ...item,
        activities: item.activities.split(",").map(a => a.trim()).filter(Boolean)
      }))
    };

    try {
      const url = isEditMode
        ? `http://localhost:5500/tours/api/tour/${id}`
        : "http://localhost:5500/tours/api/tour";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Tour ${isEditMode ? "updated" : "created"} successfully`);
        navigate("/tour-guide/my-tours");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save tour");
      }
    } catch (error) {
      console.error("Error saving tour:", error);
      toast.error("Error saving tour");
    }
  };

  return (
    <DashboardLayout title={isEditMode ? "Edit Tour" : "Create Tour"} sidebarItems={tourGuideSidebarItems}>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-6">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Tour" : "Create New Tour"}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 days"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Location</label>
                <input
                  type="text"
                  name="startLocation"
                  value={formData.startLocation}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
                <input
                  type="number"
                  name="price.amount"
                  value={formData.price.amount}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Main Image URL</label>
              <input
                type="text"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
          </div>

          {/* Lists */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Adventure, Hiking, Nature"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Available Months (comma separated)</label>
              <input
                type="text"
                name="availableMonths"
                value={formData.availableMonths}
                onChange={handleChange}
                placeholder="January, February, March"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">What's Included (comma separated)</label>
              <textarea
                name="includes"
                value={formData.includes}
                onChange={handleChange}
                placeholder="Transport, Meals, Guide"
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Booking Details</h2>
              <button
                type="button"
                onClick={handleAddBookingDetail}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <FaPlus /> Add Date
              </button>
            </div>
            {formData.bookingDetails.map((detail, index) => (
              <div key={index} className="flex flex-col gap-2 bg-gray-50 p-4 rounded-md">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500">Start Date</label>
                    <input
                      type="date"
                      value={detail.startDate}
                      onChange={(e) => handleBookingDetailChange(index, "startDate", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500">Start Day</label>
                    <input
                      type="text"
                      placeholder="e.g. Sat"
                      value={detail.startDay}
                      readOnly
                      className="block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500">End Date</label>
                    <input
                      type="date"
                      value={detail.endDate}
                      onChange={(e) => handleBookingDetailChange(index, "endDate", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500">End Day</label>
                    <input
                      type="text"
                      placeholder="e.g. Tue"
                      value={detail.endDay}
                      readOnly
                      className="block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-100"
                    />
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500">Status</label>
                    <select
                      value={detail.status}
                      onChange={(e) => handleBookingDetailChange(index, "status", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    >
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Full">Full</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500">Discount (%)</label>
                    <input
                      type="number"
                      value={detail.discount}
                      onChange={(e) => handleBookingDetailChange(index, "discount", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBookingDetail(index)}
                    className="text-red-500 hover:text-red-700 mt-4"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Destinations */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Places to Visit</h2>
              <button
                type="button"
                onClick={handleAddDestination}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <FaPlus /> Add Place
              </button>
            </div>
            {formData.destinations.map((dest, index) => (
              <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-md">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Place Name"
                    value={dest.name}
                    onChange={(e) => handleDestinationChange(index, "name", e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={dest.image}
                    onChange={(e) => handleDestinationChange(index, "image", e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDestination(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Itinerary */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Itinerary</h2>
              <button
                type="button"
                onClick={handleAddItineraryItem}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <FaPlus /> Add Day
              </button>
            </div>
            {formData.itinerary.map((item, index) => (
              <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-md">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Day (e.g. 01)"
                      value={item.day}
                      onChange={(e) => handleItineraryChange(index, "day", e.target.value)}
                      className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={item.location}
                      onChange={(e) => handleItineraryChange(index, "location", e.target.value)}
                      className="block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>
                  <textarea
                    placeholder="Activities (comma separated)"
                    value={item.activities}
                    onChange={(e) => handleItineraryChange(index, "activities", e.target.value)}
                    rows="2"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItineraryItem(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate("/tour-guide/my-tours")}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditMode ? "Update Tour" : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
