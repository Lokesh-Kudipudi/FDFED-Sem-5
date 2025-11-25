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
  FaFileInvoiceDollar,
} from "react-icons/fa";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import toast from "react-hot-toast";

const getStatusColor = (status) => {
  const s = status?.toLowerCase() || "";
  if (s === "booked") return { bg: "bg-green-50", text: "text-green-700", icon: FaCheckCircle };
  if (s === "cancelled") return { bg: "bg-red-50", text: "text-red-700", icon: FaTimesCircle };
  if (s === "checkin") return { bg: "bg-blue-50", text: "text-blue-700", icon: FaClock };
  if (s === "checkout") return { bg: "bg-yellow-50", text: "text-yellow-700", icon: FaClock };
  return { bg: "bg-gray-50", text: "text-gray-700", icon: FaClock };
};

export default function HotelMangementBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null); // For modal

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

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.userId?.fullName?.toLowerCase().includes(term) ||
          b._id.toLowerCase().includes(term) ||
          b.userId?.email?.toLowerCase().includes(term)
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter(
        (b) => b.bookingDetails?.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Date Filter (Simple implementation for now)
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter((b) => {
        const bookingDate = new Date(b.createdAt);
        if (dateFilter === "today") {
          return bookingDate >= today;
        }
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
        // Refresh bookings
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

  return (
    <DashboardLayout title="Bookings" sidebarItems={hotelManagerSidebarItems}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and track all your hotel reservations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search guest, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-gray-200 text-gray-900 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 pl-4 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="booked">Booked</option>
                <option value="checkin">Checked In</option>
                <option value="checkout">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 pl-4 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FaFileInvoiceDollar size={48} className="mb-4 opacity-50" />
              <p className="text-lg">No bookings found matching your criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-semibold">Booking ID</th>
                  <th className="p-4 font-semibold">Guest</th>
                  <th className="p-4 font-semibold">Dates</th>
                  <th className="p-4 font-semibold">Room & Price</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const status = booking.bookingDetails?.status || "Unknown";
                  const { bg, text, icon: Icon } = getStatusColor(status);
                  const checkIn = booking.bookingDetails?.checkInDate ? new Date(booking.bookingDetails.checkInDate).toLocaleDateString() : "N/A";
                  const checkOut = booking.bookingDetails?.checkOutDate ? new Date(booking.bookingDetails.checkOutDate).toLocaleDateString() : "N/A";

                  return (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4">
                        <span className="font-mono text-gray-500 text-xs">#{booking._id.slice(-6)}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {booking.userId?.fullName?.charAt(0) || "G"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{booking.userId?.fullName || "Unknown Guest"}</div>
                            <div className="text-xs text-gray-500">{booking.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs w-12">In:</span> {checkIn}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 text-xs w-12">Out:</span> {checkOut}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium">Standard Room</div> {/* Placeholder if room type not in details */}
                          <div className="text-green-600 font-mono mt-1">₹{booking.bookingDetails?.price?.toLocaleString("en-IN") || 0}</div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text} border border-current/10`}>
                          <Icon size={10} />
                          {status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {status.toLowerCase() === 'booked' && (
                            <button 
                              onClick={() => handleCancelBooking(booking._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel Booking"
                            >
                              <FaBan />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimesCircle size={24} />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest Information</label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-gray-900 font-medium">{selectedBooking.userId?.fullName}</div>
                      <div className="text-gray-500 text-sm mt-1">{selectedBooking.userId?.email}</div>
                      <div className="text-gray-500 text-sm">{selectedBooking.userId?.phone || "No phone provided"}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Info</label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="text-gray-500">Total Amount</span>
                      <span className="text-xl font-bold text-green-600">₹{selectedBooking.bookingDetails?.price?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reservation Details</label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check In</span>
                        <span className="text-gray-900">{selectedBooking.bookingDetails?.checkInDate ? new Date(selectedBooking.bookingDetails.checkInDate).toDateString() : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check Out</span>
                        <span className="text-gray-900">{selectedBooking.bookingDetails?.checkOutDate ? new Date(selectedBooking.bookingDetails.checkOutDate).toDateString() : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Guests</span>
                        <span className="text-gray-900">{selectedBooking.bookingDetails?.guests || 1} Guests</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-gray-500">Status</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(selectedBooking.bookingDetails?.status).text} bg-white border border-gray-200`}>
                          {selectedBooking.bookingDetails?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-sm">
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
