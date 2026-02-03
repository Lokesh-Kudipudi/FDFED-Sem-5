import React, { useState, useEffect, useMemo } from "react";
import { FaHotel, FaMapMarkerAlt, FaSearch, FaDollarSign, FaCalendar } from "react-icons/fa";
import HotelBookingsChart from "../../components/dashboard/admin/HotelBookingsChart.jsx";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout.jsx";
import { adminSidebarItems } from "../../components/dashboard/admin/adminSidebarItems.jsx";

export default function AdminHotelManagement() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [editingCommissionId, setEditingCommissionId] = useState(null);
  const [newCommissionRate, setNewCommissionRate] = useState("");

  const handleCommissionUpdate = async (hotelId) => {
    try {
        const response = await fetch(`http://localhost:5500/dashboard/api/admin/hotels/${hotelId}/commission`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ commissionRate: newCommissionRate }),
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to update commission");

        const updatedHotel = await response.json();
        
        // Update local state
        const updatedAnalytics = { ...analytics };
        const hotelIndex = updatedAnalytics.hotelAnalytics.findIndex(h => h._id === hotelId);
        if (hotelIndex !== -1) {
            updatedAnalytics.hotelAnalytics[hotelIndex].commissionRate = parseFloat(newCommissionRate);
        }
        setAnalytics(updatedAnalytics);
        setEditingCommissionId(null);
        setNewCommissionRate("");
    } catch (err) {
        console.error(err);
        alert("Failed to update commission rate");
    }
  };

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

  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        const term = searchTerm.toLowerCase();
        return (
          term === "" ||
          hotel.title.toLowerCase().includes(term) ||
          (hotel.location && hotel.location.toLowerCase().includes(term))
        );
      })
      .filter((hotel) => {
        return (
          selectedLocation === "" ||
          (hotel.location && hotel.location.toLowerCase().includes(selectedLocation))
        );
      });
  }, [hotels, searchTerm, selectedLocation]);

  const uniqueLocations = useMemo(() => {
    const locs = new Set(hotels.map(h => h.location).filter(Boolean));
    return Array.from(locs);
  }, [hotels]);

  if (loading) {
    return (
      <DashboardLayout title="Hotel Management" sidebarItems={adminSidebarItems}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Hotel Management" sidebarItems={adminSidebarItems}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Hotel Management" sidebarItems={adminSidebarItems}>
      <div className="p-8 space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2 flex items-center gap-3">
            <span className="bg-blue-50 p-2 rounded-xl text-3xl">🏨</span> Hotel Management
          </h1>
          <p className="text-gray-500 text-lg">Monitor hotel performance and booking analytics.</p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#003366] to-[#0055aa] p-6 rounded-[2rem] shadow-xl shadow-blue-900/20 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Total Hotels</div>
            <div className="text-4xl font-bold">{analytics?.totalHotels || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Bookings</div>
            <div className="text-4xl font-bold text-[#003366]">{hotels.reduce((sum, h) => sum + (h.totalBookings || 0), 0)}</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-green-600">₹{hotels.reduce((sum, h) => sum + (h.totalRevenue || 0), 0).toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Hotels by Bookings</h2>
          <HotelBookingsChart topHotels={analytics?.topHotels || []} />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by hotel name or location..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600">Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none font-medium"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc.toLowerCase()}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel, idx) => (
              <div
                key={hotel._id}
                className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={hotel.mainImage} 
                    alt={hotel.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-400" /> {hotel.location}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1"><FaCalendar className="text-gray-400" /> Bookings</span>
                      <span className="font-bold text-[#003366]">{hotel.totalBookings || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-green-600">₹{hotel.totalRevenue?.toLocaleString('en-IN') || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1"><FaDollarSign className="text-blue-500" /> Comm. Paid</span>
                      <span className="font-bold text-blue-600">₹{hotel.totalCommission?.toLocaleString('en-IN') || 0}</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                             <span className="text-sm font-bold text-gray-700">Commission Rate</span>
                             {editingCommissionId === hotel._id ? (
                                 <div className="flex items-center gap-2">
                                     <input 
                                         type="number" 
                                         value={newCommissionRate}
                                         onChange={(e) => setNewCommissionRate(e.target.value)}
                                         className="w-16 border rounded px-2 py-1 text-sm"
                                         min="0"
                                         max="100"
                                     />
                                     <button onClick={() => handleCommissionUpdate(hotel._id)} className="text-green-600 text-xs font-bold hover:underline">Save</button>
                                     <button onClick={() => setEditingCommissionId(null)} className="text-red-500 text-xs hover:underline">Cancel</button>
                                 </div>
                             ) : (
                                 <div className="flex items-center gap-2">
                                     <span className="text-sm font-bold text-[#003366]">{hotel.commissionRate || 10}%</span>
                                     <button 
                                         onClick={() => {
                                             setEditingCommissionId(hotel._id);
                                             setNewCommissionRate(hotel.commissionRate || 10);
                                         }}
                                         className="text-gray-400 hover:text-[#003366] text-xs"
                                     >
                                         Edit
                                     </button>
                                 </div>
                             )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No hotels found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
