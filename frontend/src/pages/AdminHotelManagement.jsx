import React, { useState, useMemo } from "react";
import {
  FaPlus,
  FaFileImport,
  FaFileExport,
  FaHotel,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
  FaMapMarkerAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaStar,
} from "react-icons/fa";

// Mock data to simulate the `hotels` prop from the EJS file
const mockHotels = [
  {
    id: 1,
    mainImage: "https://via.placeholder.com/150/3498db/ffffff?text=Hotel+A",
    title: "The Grand Resort",
    location: "Bali, Indonesia",
    status: "Active",
    roomType: ["Standard", "Deluxe", "Suite"],
    price: 250,
    rating: 5,
  },
  {
    id: 2,
    mainImage: "https://via.placeholder.com/150/e74c3c/ffffff?text=Hotel+B",
    title: "Sunset Bungalows",
    location: "Bangkok, Thailand",
    status: "Pending",
    roomType: ["Bungalow"],
    price: 120,
    rating: 4,
  },
  {
    id: 3,
    mainImage: "https://via.placeholder.com/150/2ecc71/ffffff?text=Hotel+C",
    title: "Ocean View Inn",
    location: "Dubai, UAE",
    status: "Active",
    roomType: ["Standard", "Ocean View"],
    price: 180,
    rating: 4,
  },
  {
    id: 4,
    mainImage: "https://via.placeholder.com/150/f39c12/ffffff?text=Hotel+D",
    title: "City Center Hotel",
    location: "Paris, France",
    status: "Inactive",
    roomType: ["Standard"],
    price: 90,
    rating: 3,
  },
  {
    id: 5,
    mainImage: "https://via.placeholder.com/150/9b59b6/ffffff?text=Hotel+E",
    title: "Tokyo Heights",
    location: "Tokyo, Japan",
    status: "Active",
    roomType: ["Standard", "Deluxe", "Business Suite"],
    price: 220,
    rating: 5,
  },
  {
    id: 6,
    mainImage: "https://via.placeholder.com/150/1abc9c/ffffff?text=Hotel+F",
    title: "Parisian Charm",
    location: "Paris, France",
    status: "Pending",
    roomType: ["Classic", "Romantic"],
    price: 150,
    rating: 4,
  },
  {
    id: 7,
    mainImage: "https://via.placeholder.com/150/e67e22/ffffff?text=Hotel+G",
    title: "Budget Stay Tokyo",
    location: "Tokyo, Japan",
    status: "Active",
    roomType: ["Single", "Double"],
    price: 70,
    rating: 2,
  },
];

// Helper component for Stat Cards (recreated from the EJS structure)
const StatsCard = ({ title, value, change, icon, bgColor, changeColor }) => (
  <div className="bg-white rounded-lg p-5 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <div className="text-gray-500 text-sm mb-1">{title}</div>
        <div className="text-2xl font-semibold text-gray-800">{value}</div>
        <div className={`flex items-center text-sm mt-1 ${changeColor}`}>
          {change.includes("+") ? (
            <FaArrowUp className="mr-1" size={12} />
          ) : (
            <FaArrowDown className="mr-1" size={12} />
          )}
          {change}
        </div>
      </div>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl ${bgColor}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

// Helper function to get Tailwind classes for status badges
const getStatusClasses = (status) => {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case "active":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "inactive":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Helper function to render star ratings
const renderStars = (rating) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
};

export default function AdminHotelManagement({ hotels = mockHotels }) {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  // Calculate stats (based on the full hotel list, not filtered)
  const totalHotels = hotels.length;
  const activeHotels = hotels.filter(
    (h) => h.status.toLowerCase() === "active"
  ).length;
  const pendingHotels = hotels.filter(
    (h) => h.status.toLowerCase() === "pending"
  ).length;
  const inactiveHotels = hotels.filter(
    (h) => h.status.toLowerCase() === "inactive"
  ).length;

  // Memoized filtering logic
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        // Search Filter (name or location)
        const term = searchTerm.toLowerCase();
        return (
          term === "" ||
          hotel.title.toLowerCase().includes(term) ||
          hotel.location.toLowerCase().includes(term)
        );
      })
      .filter((hotel) => {
        // Location Filter (matches the 'value' from EJS dropdown)
        return (
          selectedLocation === "" ||
          hotel.location.toLowerCase().includes(selectedLocation)
        );
      })
      .filter((hotel) => {
        // Status Filter
        return (
          selectedStatus === "" || hotel.status.toLowerCase() === selectedStatus
        );
      })
      .filter((hotel) => {
        // Rating Filter (matches the logic from EJS dropdown)
        if (selectedRating === "") return true;
        const rating = parseInt(selectedRating);
        if (rating === 5) return hotel.rating === 5;
        if (rating === 4) return hotel.rating === 4;
        if (rating === 3) return hotel.rating === 3;
        if (rating === 2) return hotel.rating <= 2;
        return false;
      });
  }, [hotels, searchTerm, selectedLocation, selectedStatus, selectedRating]);

  // Handle filter reset
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedStatus("");
    setSelectedRating("");
  };

  return (
    <div className="p-5 bg-gray-50 min-h-full">
      {/* Page Header (Recreated from EJS) */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">
          Hotel Management
        </h1>
        <div className="flex gap-3">
          <button className="flex items-center bg-transparent border border-gray-300 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50">
            <FaFileImport className="mr-2" /> Import
          </button>
          <button className="flex items-center bg-transparent border border-gray-300 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50">
            <FaFileExport className="mr-2" /> Export
          </button>
          <button className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700">
            <FaPlus className="mr-2" /> Add New Hotel
          </button>
        </div>
      </div>

      {/* Stats Cards (Recreated from EJS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <StatsCard
          title="Total Hotels"
          value={totalHotels}
          change="+5 this month"
          icon={<FaHotel />}
          bgColor="bg-blue-500"
          changeColor="text-green-600"
        />
        <StatsCard
          title="Active Hotels"
          value={activeHotels}
          change={`${((activeHotels / totalHotels) * 100).toFixed(
            1
          )}% of total`}
          icon={<FaCheckCircle />}
          bgColor="bg-green-500"
          changeColor="text-green-600"
        />
        <StatsCard
          title="Pending Approval"
          value={pendingHotels}
          change="+3 this week"
          icon={<FaClock />}
          bgColor="bg-yellow-500"
          changeColor="text-green-600" // Original EJS shows positive arrow
        />
        <StatsCard
          title="Inactive Hotels"
          value={inactiveHotels}
          change="-2 this month"
          icon={<FaTimesCircle />}
          bgColor="bg-red-500"
          changeColor="text-red-600"
        />
      </div>

      {/* Filters Section (Recreated from EJS) */}
      <div className="bg-white rounded-lg p-5 shadow-sm mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Search</label>
            <input
              type="text"
              className="p-2.5 rounded-md border border-gray-300 w-full text-sm"
              placeholder="Hotel name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Location</label>
            <select
              className="p-2.5 rounded-md border border-gray-300 w-full text-sm bg-white"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="bali">Bali, Indonesia</option>
              <option value="bangkok">Bangkok, Thailand</option>
              <option value="dubai">Dubai, UAE</option>
              <option value="paris">Paris, France</option>
              <option value="tokyo">Tokyo, Japan</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Status</label>
            <select
              className="p-2.5 rounded-md border border-gray-300 w-full text-sm bg-white"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Star Rating</label>
            <select
              className="p-2.5 rounded-md border border-gray-300 w-full text-sm bg-white"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars and Below</option>
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="flex items-center bg-transparent border border-gray-300 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50"
            onClick={resetFilters}
          >
            Reset
          </button>
          {/* "Apply Filters" button is omitted as filters apply on-change, which is a better UX in React */}
        </div>
      </div>

      {/* Hotel List Section (Recreated from EJS) */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Hotel Info
                </th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Room Types
                </th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Base Price
                </th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Rating
                </th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  {/* Hotel Info */}
                  <td className="py-4 px-5 border-b border-gray-200">
                    <div className="flex items-center">
                      <img
                        src={hotel.mainImage}
                        alt={hotel.title}
                        className="w-12 h-12 rounded-md object-cover mr-4"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 text-sm">
                          {hotel.title}
                        </span>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <FaMapMarkerAlt className="mr-1.5" size={12} />
                          {hotel.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="py-4 px-5 border-b border-gray-200 text-sm">
                    <span
                      className={`inline-block py-1 px-3 rounded-full text-xs font-medium ${getStatusClasses(
                        hotel.status
                      )}`}
                    >
                      {hotel.status}
                    </span>
                  </td>
                  {/* Room Types */}
                  <td className="py-4 px-5 border-b border-gray-200 text-sm">
                    {hotel.roomType.length}
                  </td>
                  {/* Base Price */}
                  <td className="py-4 px-5 border-b border-gray-200 text-sm">
                    ${hotel.price.toFixed(2)}
                  </td>
                  {/* Rating */}
                  <td className="py-4 px-5 border-b border-gray-200 text-sm">
                    {renderStars(hotel.rating)}
                  </td>
                  {/* Actions (Recreated from EJS) */}
                  <td className="py-4 px-5 border-b border-gray-200">
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-md flex items-center justify-center text-white bg-green-500 hover:bg-green-600">
                        <FaEye size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-md flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600">
                        <FaEdit size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-md flex items-center justify-center text-white bg-red-500 hover:bg-red-600">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
