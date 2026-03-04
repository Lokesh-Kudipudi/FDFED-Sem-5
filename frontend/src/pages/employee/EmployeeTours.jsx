import { useEffect, useMemo, useState } from "react";
import { FaMapMarkedAlt, FaMapMarkerAlt, FaSearch, FaStar } from "react-icons/fa";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { employeeSidebarItems } from "../../components/dashboard/employee/employeeSidebarItems";
import { API } from "../../config/api";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function EmployeeTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch(API.EMPLOYEE.TOURS, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to fetch assigned tours");
        }

        setTours(Array.isArray(data.data) ? data.data : []);
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load assigned tours");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const filteredTours = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tours;

    return tours.filter((tour) => {
      return [tour.title, tour.startLocation, tour.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [tours, search]);

  if (loading) {
    return (
      <DashboardLayout title="Assigned Tours" sidebarItems={employeeSidebarItems}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Assigned Tours" sidebarItems={employeeSidebarItems}>
        <div className="p-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Assigned Tours" sidebarItems={employeeSidebarItems}>
      <div className="p-8 space-y-8 animate-fade-in">
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">Assigned Tours</h1>
          <p className="text-gray-500 text-lg">Read-only view of your assigned tours and booking performance.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, start location, or status..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
            />
          </div>
        </div>

        {filteredTours.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-white border border-gray-200 flex items-center justify-center text-3xl text-gray-500 mb-6">
              <FaMapMarkedAlt />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">No assigned tours found</h3>
            <p className="text-gray-500 mt-2">
              {tours.length === 0
                ? "You do not have active tour assignments yet."
                : "No tours match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/40 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{tour.title || "Untitled Tour"}</h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-500" />
                      {tour.startLocation || "Location not available"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${String(tour.status).toLowerCase() === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                    {tour.status || "unknown"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs uppercase tracking-widest text-blue-700 font-semibold">Bookings</p>
                    <p className="text-2xl font-bold text-[#003366]">{tour.totalBookings || 0}</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-3">
                    <p className="text-xs uppercase tracking-widest text-green-700 font-semibold">Revenue</p>
                    <p className="text-xl font-bold text-[#003366]">{formatCurrency(tour.totalRevenue)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><FaStar className="text-amber-500" /> Rating: {tour.rating || 0}</p>
                  <p>Assigned date: {formatDate(tour.assignedDate)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
