import { useState, useEffect } from "react";
import StatsCard from "../components/dashboard/admin/StatsCard";
import PopularDestinations from "../components/dashboard/admin/PopularDestinations";
import BookingChart from "../components/dashboard/admin/BookingChart";
import CustomTourRequests from "../components/admin/CustomTourRequests";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { adminSidebarItems } from "../components/dashboard/admin/adminSidebarItems.jsx";
import { FaChartBar, FaDollarSign, FaUsers, FaHotel } from "react-icons/fa";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("http://localhost:5500/dashboard/api/admin-dashboard", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard" sidebarItems={adminSidebarItems}>
      <div className="p-8 space-y-8 animate-fade-in">
          <div className="border-b border-gray-100 pb-6">
            <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 text-lg">Welcome back! Here's what's happening with your platform.</p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-[#003366]">
                  <FaChartBar size={24} />
                </div>
              </div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Bookings</div>
              <div className="text-4xl font-bold text-[#003366]">{analytics?.totalBookings || 0}</div>
            </div>

            <div className="bg-gradient-to-br from-[#003366] to-[#0055aa] p-6 rounded-[2rem] shadow-xl shadow-blue-900/20 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FaDollarSign size={24} />
                </div>
              </div>
              <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</div>
              <div className="text-3xl font-bold">₹{analytics?.totalRevenue?.toLocaleString('en-IN') || 0}</div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                  <FaUsers size={24} />
                </div>
              </div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Customers</div>
              <div className="text-4xl font-bold text-gray-800">{analytics?.totalCustomers || 0}</div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                  <FaHotel size={24} />
                </div>
              </div>
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Hotels</div>
              <div className="text-4xl font-bold text-gray-800">{analytics?.totalHotels || 0}</div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Booking Analytics
                </h2>
                <Link
                  className="text-sm text-[#003366] hover:text-blue-900 font-bold"
                  to="/admin/analytics"
                >
                  View Details →
                </Link>
              </div>
              <BookingChart monthlyData={analytics?.monthlyBookings} />
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Bookings
                </h2>
                <Link
                  className="text-sm text-[#003366] hover:text-blue-900 font-bold"
                  to="/admin/bookings"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {analytics?.recentBookings?.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="font-bold text-gray-800 text-sm">{booking.userId?.fullName || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{booking.userId?.email}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</span>
                      <span className="font-bold text-[#003366]">₹{booking.bookingDetails?.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
                {!analytics?.recentBookings?.length && (
                  <div className="py-8 text-center text-gray-400">No bookings found</div>
                )}
              </div>
            </div>
          </div>



          {/* Custom Tour Requests */}
          <CustomTourRequests />

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-[#003366] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/admin/customers" className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                <p className="font-semibold text-green-700">View Customers</p>
              </Link>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}
