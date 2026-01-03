import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaBan,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import toast from "react-hot-toast";

const getStatusColor = (status) => {
  const s = status?.toLowerCase() || "";
  if (s === "booked") return { bg: "bg-green-50", text: "text-green-700", icon: FaCheckCircle };
  if (s === "cancel") return { bg: "bg-red-50", text: "text-red-700", icon: FaTimesCircle };
  if (s === "checkin") return { bg: "bg-blue-50", text: "text-blue-700", icon: FaClock };
  if (s === "checkout") return { bg: "bg-yellow-50", text: "text-yellow-700", icon: FaClock };
  return { bg: "bg-gray-50", text: "text-gray-700", icon: FaClock };
};

export default function HotelManagerBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, dateFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5500/dashboard/api/hotelManager/booking", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.bookings) {
        setBookings(data.bookings);
        setFilteredBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let result = [...bookings];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.userId?.fullName?.toLowerCase().includes(term) ||
          b._id.toLowerCase().includes(term) ||
          b.userId?.email?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (b) => b.bookingDetails?.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter((b) => {
        const bookingDate = new Date(b.createdAt);
        if (dateFilter === "today") return bookingDate >= today;
        if (dateFilter === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return bookingDate >= weekAgo;
        }
        if (dateFilter === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return bookingDate >= monthAgo;
        }
        return true;
      });
    }

    setFilteredBookings(result);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`http://localhost:5500/dashboard/api/bookings/cancel/${bookingId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        fetchBookings();
        toast.success("Booking cancelled successfully");
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Bookings" sidebarItems={hotelManagerSidebarItems}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Bookings" sidebarItems={hotelManagerSidebarItems}>
      <div className="p-8 space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2 flex items-center gap-3">
            <span className="bg-blue-50 p-2 rounded-xl text-3xl">📅</span> Hotel Bookings
          </h1>
          <p className="text-gray-500 text-lg">Manage and track all your hotel reservations.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search guest, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none font-medium"
            >
              <option value="all">All Status</option>
              <option value="pending">Booked</option>
              <option value="checkin">Checked In</option>
              <option value="checkout">Checked Out</option>
              <option value="cancel">Cancelled</option>
            </select>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
            <FaCalendarAlt className="text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none font-medium"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Bookings</div>
            <div className="text-4xl font-bold text-[#003366]">{bookings.length}</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Booked</div>
            <div className="text-4xl font-bold text-[#003366]">{bookings.filter(b => b.bookingDetails?.status?.toLowerCase() === 'booked').length}</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Checked In</div>
            <div className="text-4xl font-bold text-[#003366]">{bookings.filter(b => b.bookingDetails?.status?.toLowerCase() === 'checkin').length}</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Search Results</div>
            <div className="text-4xl font-bold text-[#003366]">{filteredBookings.length}</div>
          </div>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {bookings.length === 0 ? "No bookings yet." : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBookings.map((booking, idx) => {
              const status = booking.bookingDetails?.status || "Unknown";
              const { bg, text, icon: Icon } = getStatusColor(status);
              const checkIn = booking.bookingDetails?.checkInDate ? new Date(booking.bookingDetails.checkInDate).toLocaleDateString() : "N/A";
              const checkOut = booking.bookingDetails?.checkOutDate ? new Date(booking.bookingDetails.checkOutDate).toLocaleDateString() : "N/A";

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-[2rem] p-6 shadow-lg shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#0055aa] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {booking.userId?.fullName?.charAt(0)?.toUpperCase() || "G"}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <FaUser size={14} className="text-gray-400" /> {booking.userId?.fullName || "Unknown Guest"}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FaEnvelope size={12} className="text-blue-400" /> {booking.userId?.email}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${bg} ${text}`}>
                      <Icon size={10} /> {status}
                    </span>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <FaCalendarAlt /> Check In
                        </span>
                        <p className="text-sm font-bold text-gray-800 mt-1">{checkIn}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <FaCalendarAlt /> Check Out
                        </span>
                        <p className="text-sm font-bold text-gray-800 mt-1">{checkOut}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</span>
                      <p className="text-sm font-bold text-green-600 mt-1">₹{booking.bookingDetails?.price?.toLocaleString("en-IN") || 0}</p>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex-1 bg-[#003366] text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
                      >
                        <FaEye /> View
                      </button>
                      {status.toLowerCase() === 'booked' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2"
                        >
                          <FaBan /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
              <div className="bg-[#003366] p-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
                  <FaTimesCircle size={24} />
                </button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guest Information</label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-xl">
                      <div className="text-gray-900 font-bold">{selectedBooking.userId?.fullName}</div>
                      <div className="text-gray-500 text-sm mt-1">{selectedBooking.userId?.email}</div>
                      <div className="text-gray-500 text-sm">{selectedBooking.userId?.phone || "No phone"}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment Info</label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-gray-500">Total Amount</span>
                      <span className="text-2xl font-bold text-green-600">₹{selectedBooking.bookingDetails?.price?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reservation Details</label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check In</span>
                        <span className="text-gray-900 font-bold">{selectedBooking.bookingDetails?.checkInDate ? new Date(selectedBooking.bookingDetails.checkInDate).toDateString() : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check Out</span>
                        <span className="text-gray-900 font-bold">{selectedBooking.bookingDetails?.checkOutDate ? new Date(selectedBooking.bookingDetails.checkOutDate).toDateString() : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Guests</span>
                        <span className="text-gray-900 font-bold">{selectedBooking.bookingDetails?.guests || 1}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-gray-500">Status</span>
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${getStatusColor(selectedBooking.bookingDetails?.status).text} bg-white border-2 border-current`}>
                          {selectedBooking.bookingDetails?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
