import React, { useState, useEffect } from "react";
import { FaCalendar, FaTimes, FaInfoCircle, FaUser, FaHotel, FaRoute } from "react-icons/fa";
import toast from "react-hot-toast";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { adminSidebarItems } from "../components/dashboard/admin/adminSidebarItems";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5500/admin/bookings", {
        credentials: "include",
      });
      const data = await response.json();
      
      if (data.status === "success") {
        setBookings(data.data);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Error loading bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const response = await fetch(`http://localhost:5500/admin/bookings/${bookingId}/cancel`, {
        method: "POST",
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        toast.success("Booking cancelled successfully!");
        setSelectedBooking(null);
        fetchBookings();
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking");
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.type === filter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Bookings Management" sidebarItems={adminSidebarItems}>
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-3 flex items-center gap-3">
            <span className="bg-blue-50 p-2 rounded-xl text-3xl">📋</span> All Bookings
          </h1>
          <p className="text-gray-500 text-lg">View and manage all platform bookings.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {["all", "Tour", "Hotel", "Custom Tour"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              filter === tab
                ? "bg-[#003366] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab === "all" ? "All Bookings" : `${tab}s`}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Bookings</div>
          <div className="text-4xl font-bold text-[#003366]">{bookings.length}</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Hotel Bookings</div>
          <div className="text-4xl font-bold text-orange-600">{bookings.filter(b => b.type === "Hotel").length}</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Tour Bookings</div>
          <div className="text-4xl font-bold text-blue-600">{bookings.filter(b => b.type === "Tour").length}</div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-sm font-bold text-gray-700">Type</th>
                <th className="text-left p-4 text-sm font-bold text-gray-700">Guest</th>
                <th className="text-left p-4 text-sm font-bold text-gray-700">Item</th>
                <th className="text-left p-4 text-sm font-bold text-gray-700">Date</th>
                <th className="text-left p-4 text-sm font-bold text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, idx) => (
                <tr
                  key={booking._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-slide-up"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                    <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.type === "Hotel" 
                        ? "bg-orange-100 text-orange-600" 
                        : booking.type === "Custom Tour"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {booking.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-900">{booking.userId?.fullName || "N/A"}</td>
                  <td className="p-4 text-sm text-gray-700">{booking.itemId?.title || "N/A"}</td>
                  <td className="p-4 text-sm text-gray-600">{formatDate(booking.createdAt)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.bookingDetails?.status === "cancel" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}>
                      {booking.bookingDetails?.status || "confirmed"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-[#003366] hover:text-blue-900 font-bold text-sm flex items-center gap-1"
                    >
                      <FaInfoCircle /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="bg-[#003366] p-6 flex justify-between items-center text-white sticky top-0">
              <h3 className="font-bold text-xl">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><FaTimes /></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><FaUser /> Guest Information</h4>
                  <p className="text-sm text-gray-600">Name: {selectedBooking.userId?.fullName}</p>
                  <p className="text-sm text-gray-600">Email: {selectedBooking.userId?.email}</p>
                  <p className="text-sm text-gray-600">Phone: {selectedBooking.userId?.phone || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    {selectedBooking.type === "Hotel" ? <FaHotel /> : <FaRoute />} {selectedBooking.type} Details
                  </h4>
                  <p className="text-sm text-gray-600">Title: {selectedBooking.itemId?.title}</p>
                  <p className="text-sm text-gray-600">Location: {selectedBooking.itemId?.location || selectedBooking.itemId?.startLocation}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><FaCalendar /> Booking Information</h4>
                <p className="text-sm text-gray-600">Booking ID: {selectedBooking._id}</p>
                <p className="text-sm text-gray-600">Date: {formatDate(selectedBooking.createdAt)}</p>
                <p className="text-sm text-gray-600">Status: {selectedBooking.bookingDetails?.status || "confirmed"}</p>
                {selectedBooking.bookingDetails?.totalPrice && (
                  <p className="text-sm text-gray-600">Total: ₹{selectedBooking.bookingDetails.totalPrice.toLocaleString()}</p>
                )}
              </div>

              {selectedBooking.bookingDetails?.status !== "cancel" && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking._id)}
                  className="w-full bg-red-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
                >
                  Cancel This Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default AdminBookings;
