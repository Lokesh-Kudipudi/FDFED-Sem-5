import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
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

function getStatusOptions(bookings) {
  const set = new Set(["all"]);
  bookings.forEach((booking) => {
    if (booking.status) set.add(String(booking.status).toLowerCase());
  });
  return Array.from(set);
}

function getDateRangeLabel(booking) {
  const start = booking?.dateRange?.startDate;
  const end = booking?.dateRange?.endDate;
  if (!start && !end) return "-";
  if (!end) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export default function EmployeeBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(API.EMPLOYEE.BOOKINGS, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(Array.isArray(data.data) ? data.data : []);
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const statusOptions = useMemo(() => getStatusOptions(bookings), [bookings]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesType = typeFilter === "all" || booking.type === typeFilter;
      const matchesStatus = statusFilter === "all" || String(booking.status || "").toLowerCase() === statusFilter;

      if (!matchesType || !matchesStatus) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        booking.user?.fullName,
        booking.user?.email,
        booking.item?.title,
        booking.type,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [bookings, typeFilter, statusFilter, search]);

  if (loading) {
    return (
      <DashboardLayout title="Employee Bookings" sidebarItems={employeeSidebarItems}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Employee Bookings" sidebarItems={employeeSidebarItems}>
        <div className="p-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Employee Bookings" sidebarItems={employeeSidebarItems}>
      <div className="p-8 space-y-8 animate-fade-in">
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">Employee Bookings</h1>
          <p className="text-gray-500 text-lg">Combined Hotel and Tour bookings for your assigned items.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search user, email, or item title..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
            >
              <option value="all">All Types</option>
              <option value="Hotel">Hotel</option>
              <option value="Tour">Tour</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status === "all" ? "All Statuses" : status}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-800">No bookings found</h3>
            <p className="text-gray-500 mt-2">
              {bookings.length === 0
                ? "Bookings will appear here when customers book your assigned hotels/tours."
                : "Try changing your filters or search."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Item</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Date Range</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">{booking.type}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{booking.user?.fullName || "Unknown User"}</div>
                        <div className="text-xs text-gray-500">{booking.user?.email || "-"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{booking.item?.title || "Unknown Item"}</div>
                        <div className="text-xs text-gray-500">{booking.item?.location || "-"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{getDateRangeLabel(booking)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{formatCurrency(booking.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
