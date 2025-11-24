import { useState, useEffect } from "react";
import {
  FaBars,
  FaEnvelope,
  FaPhone,
  FaEllipsisV,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaHotel,
} from "react-icons/fa";
import HotelManagerTopbar from "./HotelManagerTopbar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getStatusColor = (status) => {
  const s = status?.toLowerCase() || "";
  if (s === "booked") return { bg: "bg-green-100", text: "text-green-700" };
  if (s === "cancelled") return { bg: "bg-red-100", text: "text-red-700" };
  if (s === "checkin") return { bg: "bg-blue-100", text: "text-blue-700" };
  if (s === "checkout") return { bg: "bg-yellow-100", text: "text-yellow-700" };
  return { bg: "bg-gray-100", text: "text-gray-700" };
};

function BookingsTable({ bookings }) {
  const [menuOpen, setMenuOpen] = useState(null);

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  if (!bookings?.length) {
    return (
      <div className="text-center py-8 text-gray-400">No bookings found.</div>
    );
  }

  return (
    <div className="rounded-lg shadow overflow-visible bg-slate-800">
      <table className="w-full text-white border-collapse">
        <thead className="bg-slate-700 text-purple-400 border-b border-slate-600">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Guest Name
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold">
              Status
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Check-In
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Check-Out
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
            <th className="px-6 py-4 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, i) => {
            const id = booking._id || `b${i}`;
            const guestName = booking.userId?.fullName ?? "N/A";
            const email = booking.userId?.email ?? "N/A";
            const phone = booking.userId?.phone ?? "N/A";
            const checkIn = booking.bookingDetails?.checkInDate ?? "N/A";
            const checkOut = booking.bookingDetails?.checkOutDate ?? "N/A";
            const status = booking.bookingDetails?.status ?? "N/A";
            const color = getStatusColor(status);

            return (
              <tr
                key={id}
                className="border-b border-slate-700 hover:bg-slate-700/50"
              >
                <td className="px-6 py-4 text-sm">{guestName}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text}`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{checkIn}</td>
                <td className="px-6 py-4 text-sm">{checkOut}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaEnvelope size={14} className="text-red-500" />
                    {email}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaPhone size={14} className="text-green-500" />
                    {phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-center relative">
                  <button
                    onClick={() => toggleMenu(id)}
                    className="p-2 hover:bg-slate-600 rounded"
                  >
                    <FaEllipsisV />
                  </button>

                  {menuOpen === id && (
                    <div className="absolute right-0 mt-1 bg-slate-900 border border-slate-700 rounded shadow-lg z-[999] text-left">
                      <a className="block px-4 py-2 text-sm hover:bg-slate-800 text-gray-200">
                        View Details
                      </a>
                      <a className="block px-4 py-2 text-sm hover:bg-slate-800 text-gray-200">
                        Edit
                      </a>
                      <a className="block px-4 py-2 text-sm hover:bg-slate-800 text-red-400">
                        Cancel
                      </a>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function HotelManagerDashboard({
  initialBookings = [],
  sidebarCollapsed,
  setSidebarCollapsed,
}) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    monthlyBookings: [],
    bookingStatusCounts: { booked: 0, cancelled: 0, checkin: 0, checkout: 0 },
  });
  const [bookings, setBookings] = useState(initialBookings);
  const [filteredBookings, setFilteredBookings] = useState(initialBookings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5500/dashboard/api/hotelManager/dashboard-stats", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.status === "success") {
          setStats(data);
          setBookings(data.recentBookings);
          setFilteredBookings(data.recentBookings);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: stats.monthlyBookings.map((item) => {
      const date = new Date();
      date.setMonth(item._id - 1);
      return date.toLocaleString("default", { month: "short" });
    }),
    datasets: [
      {
        label: "Bookings",
        data: stats.monthlyBookings.map((item) => item.count),
        backgroundColor: "rgba(147, 51, 234, 0.5)",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "white" },
      },
      title: {
        display: true,
        text: "Monthly Bookings",
        color: "white",
      },
    },
    scales: {
      y: {
        ticks: { color: "gray" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "gray" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  return (
    <main className="flex-1 overflow-auto">
      {/* Top Bar */}
      <HotelManagerTopbar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here's what's happening with your hotel.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <FaCalendarCheck className="text-purple-500" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-400">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.totalBookings}</h3>
            <p className="text-sm text-gray-400 mt-1">Total Bookings</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <FaMoneyBillWave className="text-green-500" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-400">Revenue</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="text-sm text-gray-400 mt-1">Total Earnings</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <FaHotel className="text-blue-500" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-400">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {stats.bookingStatusCounts.checkin}
            </h3>
            <p className="text-sm text-gray-400 mt-1">Currently Checked In</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <FaCalendarCheck className="text-yellow-500" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-400">Pending</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {stats.bookingStatusCounts.booked}
            </h3>
            <p className="text-sm text-gray-400 mt-1">Upcoming Bookings</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg border border-slate-700">
            <Bar options={chartOptions} data={chartData} />
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded transition">
                Add New Room
              </button>
              <button className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded transition">
                View All Bookings
              </button>
              <button className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded transition">
                Manage Availability
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 animate-pulse">
            Loading bookings...
          </div>
        ) : (
          <BookingsTable bookings={filteredBookings} />
        )}
      </div>
    </main>
  );
}
