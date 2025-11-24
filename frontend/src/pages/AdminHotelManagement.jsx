import React, { useState, useEffect, useMemo } from "react";
import {
  FaHotel,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Sidebar from "../components/dashboard/admin/Sidebar";
import Topbar from "../components/dashboard/admin/Topbar";
import HotelBookingsChart from "../components/dashboard/admin/HotelBookingsChart";

// Helper component for Stat Cards
const StatsCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white rounded-lg p-5 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <div className="text-gray-500 text-sm mb-1">{title}</div>
        <div className="text-2xl font-semibold text-gray-800">{value}</div>
      </div>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl ${bgColor}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminHotelManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("http://localhost:5500/dashboard/api/admin/hotel-analytics", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch hotel analytics");
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const hotels = useMemo(() => analytics?.hotelAnalytics || [], [analytics]);

  // Memoized filtering logic
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        // Search Filter (name or location)
        const term = searchTerm.toLowerCase();
        return (
          term === "" ||
          hotel.title.toLowerCase().includes(term) ||
          (hotel.location && hotel.location.toLowerCase().includes(term))
        );
      })
      .filter((hotel) => {
        // Location Filter
        return (
          selectedLocation === "" ||
          (hotel.location && hotel.location.toLowerCase().includes(selectedLocation))
        );
      });
  }, [hotels, searchTerm, selectedLocation]);

  // Handle filter reset
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
  };

  const uniqueLocations = useMemo(() => {
    const locs = new Set(hotels.map(h => h.location).filter(Boolean));
    return Array.from(locs);
  }, [hotels]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 p-6 flex flex-col overflow-hidden">
        <Topbar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          collapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                Hotel Management
              </h1>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading hotel data...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">Error: {error}</div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatsCard
                        title="Total Hotels"
                        value={analytics?.totalHotels || 0}
                        icon={<FaHotel />}
                        bgColor="bg-blue-500"
                        />
                    </div>

                    {/* Chart Section */}
                    <div className="mb-5">
                        <HotelBookingsChart topHotels={analytics?.topHotels || []} />
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-lg p-5 shadow-sm">
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
                            {uniqueLocations.map(loc => (
                                <option key={loc} value={loc.toLowerCase()}>{loc}</option>
                            ))}
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
                        </div>
                    </div>

                    {/* Hotel List Section */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                                Hotel Info
                                </th>
                                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                                Bookings
                                </th>
                                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                                Revenue
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredHotels.map((hotel) => (
                                <tr key={hotel._id} className="hover:bg-gray-50">
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
                                {/* Bookings */}
                                <td className="py-4 px-5 border-b border-gray-200 text-sm">
                                    {hotel.totalBookings}
                                </td>
                                {/* Revenue */}
                                <td className="py-4 px-5 border-b border-gray-200 text-sm">
                                    ₹{hotel.totalRevenue?.toLocaleString('en-IN')}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
