import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBuilding, FaCalendarAlt, FaMapMarkedAlt, FaRupeeSign } from "react-icons/fa";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { employeeSidebarItems } from "../../components/dashboard/employee/employeeSidebarItems";
import { API } from "../../config/api";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function statusClass(status) {
  const normalized = String(status || "pending").toLowerCase();
  if (["cancel", "cancelled"].includes(normalized)) return "bg-red-100 text-red-700";
  if (["complete", "completed"].includes(normalized)) return "bg-blue-100 text-blue-700";
  if (["booked", "checkedin", "occupied"].includes(normalized)) return "bg-emerald-100 text-emerald-700";
  return "bg-amber-100 text-amber-700";
}

export default function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API.EMPLOYEE.STATS, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to fetch employee stats");
        }

        setStats(data.data);
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Employee Dashboard" sidebarItems={employeeSidebarItems}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Employee Dashboard" sidebarItems={employeeSidebarItems}>
        <div className="p-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  const hasAssignments = (stats?.totalAssignedHotels || 0) + (stats?.totalAssignedTours || 0) > 0;

  return (
    <DashboardLayout title="Employee Dashboard" sidebarItems={employeeSidebarItems}>
      <div className="p-8 space-y-8 animate-fade-in">
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">Employee Dashboard</h1>
          <p className="text-gray-500 text-lg">Track your assignments, booking activity, and handled revenue.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40">
            <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Assigned Hotels</div>
            <div className="text-4xl font-bold text-[#003366] flex items-center gap-3"><FaBuilding />{stats?.totalAssignedHotels || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40">
            <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Assigned Tours</div>
            <div className="text-4xl font-bold text-[#003366] flex items-center gap-3"><FaMapMarkedAlt />{stats?.totalAssignedTours || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40">
            <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Active Bookings</div>
            <div className="text-4xl font-bold text-emerald-600 flex items-center gap-3"><FaCalendarAlt />{stats?.activeBookings || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-[#003366] to-[#0055aa] p-6 rounded-[2rem] shadow-xl shadow-blue-900/20 text-white">
            <div className="text-xs uppercase tracking-widest text-blue-100 font-bold mb-2">Revenue Handled</div>
            <div className="text-3xl font-bold flex items-center gap-3"><FaRupeeSign />{Number(stats?.revenueHandled || 0).toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Recent Booking Activity</h2>
              <Link to="/employee/bookings" className="text-sm font-semibold text-[#003366] hover:underline">View all</Link>
            </div>

            {!stats?.recentBookings?.length ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                <p className="text-lg font-semibold text-gray-700">No booking activity yet</p>
                <p className="text-gray-500 mt-1">Bookings for your assigned hotels/tours will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="py-3 text-xs uppercase tracking-wider text-gray-400">Type</th>
                      <th className="py-3 text-xs uppercase tracking-wider text-gray-400">Item</th>
                      <th className="py-3 text-xs uppercase tracking-wider text-gray-400">User</th>
                      <th className="py-3 text-xs uppercase tracking-wider text-gray-400">Status</th>
                      <th className="py-3 text-xs uppercase tracking-wider text-gray-400 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="py-3 text-sm font-medium text-gray-700">{booking.type}</td>
                        <td className="py-3 text-sm text-gray-700">{booking.item?.title || "-"}</td>
                        <td className="py-3 text-sm text-gray-700">{booking.user?.fullName || "-"}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-sm font-semibold text-gray-800">{formatCurrency(booking.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <Link to="/employee/hotels" className="block rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-all">
              <p className="font-semibold text-[#003366]">Assigned Hotels</p>
              <p className="text-sm text-gray-500 mt-1">Review hotel assignments and metrics.</p>
            </Link>
            <Link to="/employee/tours" className="block rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-all">
              <p className="font-semibold text-[#003366]">Assigned Tours</p>
              <p className="text-sm text-gray-500 mt-1">Check your assigned tours and status.</p>
            </Link>
            <Link to="/employee/bookings" className="block rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-all">
              <p className="font-semibold text-[#003366]">Bookings</p>
              <p className="text-sm text-gray-500 mt-1">Filter and monitor booking activity.</p>
            </Link>
            <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
              <p className="text-sm font-semibold text-[#003366]">Cancelled / Completed</p>
              <p className="text-sm text-gray-700 mt-1">
                {stats?.cancelledBookings || 0} cancelled, {stats?.completedBookings || 0} completed
              </p>
              <p className="text-xs text-gray-500 mt-1">Last updated: {formatDate(new Date())}</p>
            </div>
          </div>
        </div>

        {!hasAssignments && (
          <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <h3 className="text-2xl font-bold text-gray-800">No assignments yet</h3>
            <p className="text-gray-500 mt-2">Once admin assigns active hotels or tours to you, they will show up in this dashboard.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
