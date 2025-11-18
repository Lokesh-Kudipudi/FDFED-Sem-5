import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaCog,
  FaPhone,
  FaEnvelope,
  FaEllipsisV,
} from "react-icons/fa";

const getStatusColor = (status) => {
  const s = status?.toLowerCase() || "";
  if (s === "booked") return { bg: "bg-green-100", text: "text-green-700" };
  if (s === "cancelled") return { bg: "bg-red-100", text: "text-red-700" };
  if (s === "checkin") return { bg: "bg-blue-100", text: "text-blue-700" };
  if (s === "checkout") return { bg: "bg-yellow-100", text: "text-yellow-700" };
  return { bg: "bg-gray-100", text: "text-gray-700" };
};

// ---------------------------------------------------
// SIDEBAR FIXED VERSION
// ---------------------------------------------------
function Sidebar({ collapsed, onToggle, openDropdown, onDropdownToggle }) {
  return (
    <aside
      className={`h-screen bg-slate-800 text-white pt-12 transition-all duration-300 overflow-y-auto flex-shrink-0 ${
        collapsed ? "w-0 opacity-0 -ml-64" : "w-64 opacity-100 ml-0"
      }`}
    >
      <div className="px-4 py-4 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-purple-400 text-center">
          Chasing Horizons
        </h2>
      </div>

      <div className="text-center py-6 border-b border-slate-700">
        <div className="w-12 h-12 rounded-full bg-purple-500 mx-auto mb-2 flex items-center justify-center text-white font-bold">
          HM
        </div>
        <h5 className="text-pink-400 text-sm font-semibold">Hotel Manager</h5>
      </div>

      <div className="text-center py-4 px-4">
        <h3 className="text-purple-400 font-semibold text-sm">DASHBOARD</h3>
      </div>

      <nav className="px-3 space-y-2">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition w-full text-left"
        >
          <FaTachometerAlt /> Overview
        </button>

        <div>
          <button
            onClick={() =>
              onDropdownToggle(openDropdown === "bookings" ? null : "bookings")
            }
            className="w-full flex items-center justify-between px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition"
          >
            <div className="flex items-center gap-3">
              <FaCalendarAlt /> Bookings
            </div>
            {openDropdown === "bookings" ? (
              <FaChevronUp size={12} />
            ) : (
              <FaChevronDown size={12} />
            )}
          </button>

          {openDropdown === "bookings" && (
            <div className="mt-1 ml-3 bg-slate-700 rounded p-2 space-y-1">
              <a className="block px-3 py-2 text-sm hover:bg-slate-600 rounded text-gray-200">
                All Bookings
              </a>
              <a className="block px-3 py-2 text-sm hover:bg-slate-600 rounded text-gray-200">
                Pending
              </a>
              <a className="block px-3 py-2 text-sm hover:bg-slate-600 rounded text-gray-200">
                Confirmed
              </a>
            </div>
          )}
        </div>

        <a className="flex items-center gap-3 px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition">
          <FaUsers /> Guests
        </a>
        <a className="flex items-center gap-3 px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition">
          <FaCog /> Settings
        </a>
      </nav>
    </aside>
  );
}

// ---------------------------------------------------
// BOOKINGS TABLE FIXED VERSION
// ---------------------------------------------------
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

// ---------------------------------------------------
// MAIN DASHBOARD FIXED VERSION
// ---------------------------------------------------
export default function HotelManagerDashboard({ initialBookings = [] }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bookings, setBookings] = useState(initialBookings);
  const [filteredBookings, setFilteredBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  // load bookings
  useEffect(() => {
    setBookings(initialBookings);
    setFilteredBookings(initialBookings);
    setLoading(false);
  }, [initialBookings]);

  // search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = bookings.filter((b) => {
      const name = b.userId?.fullName?.toLowerCase() || "";
      const email = b.userId?.email?.toLowerCase() || "";
      return name.includes(term) || email.includes(term);
    });

    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        openDropdown={openDropdown}
        onDropdownToggle={setOpenDropdown}
      />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded hover:bg-slate-700 transition"
          >
            <FaBars className="text-white" size={20} />
          </button>

          <div className="flex-1 mx-6">
            <div className="relative max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded"
              />
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold cursor-pointer">
            HM
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Bookings</h1>
            <p className="text-gray-400 mt-1">
              Manage and view all your hotel bookings
            </p>
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
    </div>
  );
}
