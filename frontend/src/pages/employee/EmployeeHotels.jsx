import { useEffect, useMemo, useState } from "react";
import { FaHotel, FaMapMarkerAlt, FaSearch, FaStar } from "react-icons/fa";
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

export default function EmployeeHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(API.EMPLOYEE.HOTELS, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        if (!response.ok || data.status !== "success") {
          throw new Error(data.message || "Failed to fetch assigned hotels");
        }

        setHotels(Array.isArray(data.data) ? data.data : []);
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load assigned hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return hotels;

    return hotels.filter((hotel) => {
      return [hotel.title, hotel.location, hotel.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [hotels, search]);

  if (loading) {
    return (
      <DashboardLayout title="Assigned Hotels" sidebarItems={employeeSidebarItems}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Assigned Hotels" sidebarItems={employeeSidebarItems}>
        <div className="p-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Assigned Hotels" sidebarItems={employeeSidebarItems}>
      <div className="p-8 space-y-8 animate-fade-in">
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">Assigned Hotels</h1>
          <p className="text-gray-500 text-lg">Read-only view of your assigned hotels and booking performance.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, location, or status..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
            />
          </div>
        </div>

        {filteredHotels.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-white border border-gray-200 flex items-center justify-center text-3xl text-gray-500 mb-6">
              <FaHotel />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">No assigned hotels found</h3>
            <p className="text-gray-500 mt-2">
              {hotels.length === 0
                ? "You do not have active hotel assignments yet."
                : "No hotels match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHotels.map((hotel) => (
              <div key={hotel._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/40 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{hotel.title || "Untitled Hotel"}</h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-500" />
                      {hotel.location || "Location not available"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${String(hotel.status).toLowerCase() === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                    {hotel.status || "unknown"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs uppercase tracking-widest text-blue-700 font-semibold">Bookings</p>
                    <p className="text-2xl font-bold text-[#003366]">{hotel.totalBookings || 0}</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-3">
                    <p className="text-xs uppercase tracking-widest text-green-700 font-semibold">Revenue</p>
                    <p className="text-xl font-bold text-[#003366]">{formatCurrency(hotel.totalRevenue)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><FaStar className="text-amber-500" /> Rating: {hotel.rating || 0}</p>
                  <p>Assigned date: {formatDate(hotel.assignedDate)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
