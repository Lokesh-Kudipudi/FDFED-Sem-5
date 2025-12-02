import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,

  FaMoneyBillWave,
  FaCalendarCheck,
  FaHotel,
} from "react-icons/fa";

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


  if (!bookings?.length) {
    return (
      <div className="text-center py-8 text-gray-500">No bookings found.</div>
    );
  }

  return (
    <div className="rounded-lg shadow overflow-visible bg-white border border-gray-200">
      <table className="w-full text-gray-800 border-collapse">
        <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
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
                className="border-b border-gray-100 hover:bg-gray-50"
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
        labels: { color: "#374151" }, // gray-700
      },
      title: {
        display: true,
        text: "Monthly Bookings",
        color: "#374151", // gray-700
      },
    },
    scales: {
      y: {
        ticks: { color: "#6B7280" }, // gray-500
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      x: {
        ticks: { color: "#6B7280" }, // gray-500
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening with your hotel.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-full">
              <FaCalendarCheck className="text-purple-500" size={24} />
            </div>
            <span className="text-xs font-medium text-gray-500">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalBookings}</h3>
          <p className="text-sm text-gray-500 mt-1">Total Bookings</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-full">
              <FaMoneyBillWave className="text-green-500" size={24} />
            </div>
            <span className="text-xs font-medium text-gray-500">Revenue</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            ₹{stats.totalRevenue.toLocaleString("en-IN")}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Total Earnings</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <FaHotel className="text-blue-500" size={24} />
            </div>
            <span className="text-xs font-medium text-gray-500">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.bookingStatusCounts.checkin}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Currently Checked In</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-full">
              <FaCalendarCheck className="text-yellow-500" size={24} />
            </div>
            <span className="text-xs font-medium text-gray-500">Pending</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.bookingStatusCounts.booked}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Upcoming Bookings</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <Bar options={chartOptions} data={chartData} />
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/hotel-manager/room-inventory"
              className="block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-center rounded transition"
            >
              Add New Room
            </Link>
            <Link
              to="/hotel-manager/bookings"
              className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center rounded transition"
            >
              View All Bookings
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 animate-pulse">
          Loading bookings...
        </div>
      ) : (
        <BookingsTable bookings={filteredBookings} />
      )}
    </div>
  );
}
