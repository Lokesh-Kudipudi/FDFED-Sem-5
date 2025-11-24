import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/admin/Sidebar";
import Topbar from "../components/dashboard/admin/Topbar";
import StatsCard from "../components/dashboard/admin/StatsCard";
import PopularDestinations from "../components/dashboard/admin/PopularDestinations";
import BookingChart from "../components/dashboard/admin/BookingChart";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((s) => !s)}
      />
      <main
        className="flex-1 transition-all duration-300"
      >
        <div className="p-6">
          <Topbar
            onToggleSidebar={() =>
              setSidebarCollapsed((s) => !s)
            }
          />

          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Dashboard Overview
          </h1>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
              title="Total Bookings"
              value={analytics?.totalBookings}
              icon="bookings"
            />
            <StatsCard
              title="Total Revenue"
              value={`₹${analytics?.totalRevenue?.toLocaleString('en-IN')}`}
              icon="revenue"
            />
            <StatsCard
              title="Total Customers"
              value={analytics?.totalCustomers}
              icon="customers"
            />
            <StatsCard
              title="Total Hotels"
              value={analytics?.totalHotels}
              icon="hotels"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Booking Analytics
                </h2>
                <Link
                  className="text-sm text-blue-500 hover:underline"
                  to="/admin/analytics"
                >
                  View Details
                </Link>
              </div>
              <BookingChart monthlyData={analytics?.monthlyBookings} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Recent Bookings
                </h2>
                <Link
                  className="text-sm text-blue-500 hover:underline"
                  to="/admin/bookings"
                >
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2">Customer</th>
                        <th className="py-2">Date</th>
                        <th className="py-2">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {analytics?.recentBookings?.map((booking) => (
                        <tr key={booking._id} className="border-t">
                        <td className="py-3">
                            <div className="font-medium text-gray-800">{booking.userId?.fullName || "Unknown"}</div>
                            <div className="text-xs text-gray-500">{booking.userId?.email}</div>
                        </td>
                        <td className="py-3 text-gray-600">
                            {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 font-medium text-gray-800">
                            ₹{booking.bookingDetails?.price?.toLocaleString('en-IN')}
                        </td>
                        </tr>
                    ))}
                    {!analytics?.recentBookings?.length && (
                        <tr>
                            <td colSpan="3" className="py-4 text-center text-gray-500">No bookings found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Popular Destinations
              </h2>
              <Link
                className="text-sm text-blue-500 hover:underline"
                to="/admin/packages"
              >
                View All
              </Link>
            </div>

            <PopularDestinations
              items={analytics?.populatedResults || []}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
