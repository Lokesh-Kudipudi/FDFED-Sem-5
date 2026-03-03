import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { API } from "../../config/api";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import {
  FaChartBar,
  FaDollarSign,
  FaUsers,
  FaHotel,
  FaMapMarkedAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ownerSidebarItems = [
  { key: "overview", label: "Overview", path: "/owner/dashboard", icon: <FaChartBar /> },
  { key: "bookings", label: "All Bookings", path: "/owner/dashboard", icon: <FaCalendarAlt /> },
  { key: "hotels", label: "Hotel Analytics", path: "/owner/dashboard", icon: <FaHotel /> },
  { key: "tours", label: "Tour Analytics", path: "/owner/dashboard", icon: <FaMapMarkedAlt /> },
];

const OwnerDashboard = () => {
  const { state } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [overviewData, setOverviewData] = useState(null);
  const [hotelsData, setHotelsData] = useState([]);
  const [toursData, setToursData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);

  if (!state.user) {
    return <Navigate to="/" replace />;
  }
  if (state.user.role !== "owner") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const opts = { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } };
        const [overviewRes, hotelsRes, toursRes, perfRes, bookingsRes] = await Promise.all([
          fetch(API.OWNER.OVERVIEW, opts),
          fetch(API.OWNER.HOTELS, opts),
          fetch(API.OWNER.TOURS, opts),
          fetch(API.OWNER.PERFORMANCE, opts),
          fetch(API.OWNER.BOOKINGS_ALL, opts),
        ]);

        const overview = await overviewRes.json();
        const hotels = await hotelsRes.json();
        const tours = await toursRes.json();
        const perf = await perfRes.json();
        const bookings = await bookingsRes.json();

        setOverviewData(overview.data);
        setHotelsData(hotels.data?.hotels || []);
        setToursData(tours.data?.tours || []);
        setPerformanceData(perf.data?.performance || []);
        setBookingsData(bookings.data?.bookings || []);
      } catch (err) {
        console.error("Error fetching owner analytics:", err);
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const fmt = (n) => `₹${(n || 0).toLocaleString("en-IN")}`;

  // --- Charts ---
  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const bookingChartData = {
    labels: (overviewData?.monthlyBookings || []).map((m) => monthNames[m._id] || m._id),
    datasets: [
      {
        label: "Bookings",
        data: (overviewData?.monthlyBookings || []).map((m) => m.count),
        backgroundColor: "rgba(0, 51, 102, 0.7)",
        borderColor: "#003366",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const revenueChartData = {
    labels: performanceData.map((d) => d.month),
    datasets: [
      {
        label: "Revenue (₹)",
        data: performanceData.map((d) => d.revenue),
        borderColor: "#003366",
        backgroundColor: "rgba(0, 51, 102, 0.1)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Bookings",
        data: performanceData.map((d) => d.bookings),
        borderColor: "#008000",
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        fill: true,
        tension: 0.3,
        yAxisID: "y1",
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    scales: {
      y: { type: "linear", display: true, position: "left", title: { display: true, text: "Revenue (₹)" } },
      y1: { type: "linear", display: true, position: "right", grid: { drawOnChartArea: false }, title: { display: true, text: "Bookings" } },
    },
  };

  // --- Render Sections ---
  const renderOverview = () => (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">
          Executive Overview
        </h1>
        <p className="text-gray-500 text-lg">
          Platform-wide read-only analytics for board-level visibility.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gradient-to-br from-[#003366] to-[#0055aa] p-6 rounded-[2rem] shadow-xl shadow-blue-900/20 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: "0ms" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><FaDollarSign size={24} /></div>
          </div>
          <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</div>
          <div className="text-3xl font-bold">{fmt(overviewData?.totalRevenue)}</div>
        </div>

        <div className="bg-gradient-to-br from-[#004d00] to-[#008000] p-6 rounded-[2rem] shadow-xl shadow-green-900/20 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><FaDollarSign size={24} /></div>
          </div>
          <div className="text-green-100 text-xs font-bold uppercase tracking-widest mb-1">Total Commission</div>
          <div className="text-3xl font-bold">{fmt(overviewData?.totalCommission)}</div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-[#003366]"><FaChartBar size={24} /></div>
          </div>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Bookings</div>
          <div className="text-4xl font-bold text-[#003366]">{overviewData?.totalBookings || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600"><FaUsers size={24} /></div>
          </div>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Customers</div>
          <div className="text-4xl font-bold text-gray-800">{overviewData?.totalCustomers || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600"><FaHotel size={24} /></div>
          </div>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Hotels</div>
          <div className="text-4xl font-bold text-gray-800">{overviewData?.totalHotels || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600"><FaMapMarkedAlt size={24} /></div>
          </div>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Tours</div>
          <div className="text-4xl font-bold text-gray-800">{overviewData?.totalTours || 0}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Analytics</h2>
          <Bar data={bookingChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Bookings</h2>
          <div className="space-y-4">
            {overviewData?.recentBookings?.slice(0, 5).map((booking) => (
              <div key={booking._id} className="pb-4 border-b border-gray-100 last:border-0">
                <div className="font-bold text-gray-800 text-sm">{booking.userId?.fullName || "Unknown"}</div>
                <div className="text-xs text-gray-500">{booking.userId?.email}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  <span className="font-bold text-[#003366]">₹{booking.bookingDetails?.price?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
            {!overviewData?.recentBookings?.length && (
              <div className="py-8 text-center text-gray-400">No bookings found</div>
            )}
          </div>
        </div>
      </div>

      {performanceData.length > 0 && (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Trend (Last 6 months)</h2>
          <Line data={revenueChartData} options={revenueChartOptions} />
        </div>
      )}
    </div>
  );

  const renderHotels = () => (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">Hotel Analytics</h1>
        <p className="text-gray-500 text-lg">Read-only view of all hotels, their managers, bookings, and revenue.</p>
      </div>
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Hotel Name</th>
                <th className="px-6 py-4">Hotel Manager</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Bookings</th>
                <th className="px-6 py-4 text-right">Revenue</th>
                <th className="px-6 py-4 text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hotelsData.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{hotel.title || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{hotel.manager}</div>
                    {hotel.managerEmail && <div className="text-gray-400 text-xs">{hotel.managerEmail}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${hotel.status === "active" ? "bg-green-100 text-green-700" : hotel.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {hotel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">{hotel.totalBookings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-[#003366]">{fmt(hotel.totalRevenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-semibold">{fmt(hotel.totalCommission)}</td>
                </tr>
              ))}
              {hotelsData.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No hotels found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTours = () => (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">Tour Analytics</h1>
        <p className="text-gray-500 text-lg">Read-only view of all tours, their guides, bookings, and revenue.</p>
      </div>
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Tour Title</th>
                <th className="px-6 py-4">Tour Guide</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Bookings</th>
                <th className="px-6 py-4 text-right">Revenue</th>
                <th className="px-6 py-4 text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {toursData.map((tour) => (
                <tr key={tour._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{tour.title || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{tour.guide}</div>
                    {tour.guideEmail && <div className="text-gray-400 text-xs">{tour.guideEmail}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${tour.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">{tour.totalBookings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-[#003366]">{fmt(tour.totalRevenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-semibold">{fmt(tour.totalCommission)}</td>
                </tr>
              ))}
              {toursData.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No tours found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">All Bookings</h1>
        <p className="text-gray-500 text-lg">
          Complete read-only view of every booking on the platform — {bookingsData.length} total.
        </p>
      </div>
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Booking Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookingsData.map((b) => {
                const st = b.bookingDetails?.status || "pending";
                const statusColor =
                  st === "booked" || st === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : st === "cancel" || st === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : st === "complete"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700";
                return (
                  <tr key={b._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-800 text-sm">{b.userId?.fullName || "Unknown"}</div>
                      <div className="text-gray-400 text-xs">{b.userId?.email}</div>
                      {b.userId?.phone && <div className="text-gray-400 text-xs">{b.userId?.phone}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.type === "Hotel" ? "bg-orange-100 text-orange-700" : "bg-purple-100 text-purple-700"}`}>{b.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 text-sm max-w-[200px] truncate">
                      {b.itemId?.title || b.itemId?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>{st}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-[#003366]">{fmt(b.bookingDetails?.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-semibold">{fmt(b.commissionAmount)}</td>
                  </tr>
                );
              })}
              {bookingsData.length === 0 && (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      title="Owner Dashboard"
      sidebarItems={ownerSidebarItems}
      activeItem={activeTab}
      onItemClick={setActiveTab}
    >
      {activeTab === "overview" && renderOverview()}
      {activeTab === "bookings" && renderBookings()}
      {activeTab === "hotels" && renderHotels()}
      {activeTab === "tours" && renderTours()}
    </DashboardLayout>
  );
};

export default OwnerDashboard;