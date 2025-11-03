// AdminPackages.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AdminPackages.jsx
 * Single-file React component using Tailwind CSS class names.
 *
 * - Mock data included (replace with real API calls)
 * - Responsive cards + packages table
 * - Tabs, search, sort, pagination, actions
 * - Default export component
 *
 * Requires: Tailwind CSS configured in the project.
 */

const mockPackages = [
  {
    _id: "pkg_1",
    title: "Himalayan Escape",
    startLocation: "Leh - Ladakh",
    duration: "7 Days",
    price: { amount: 12999 },
    totalBookings: 42,
    rating: 4.6,
    status: "active",
  },
  {
    _id: "pkg_2",
    title: "Kerala Backwaters",
    startLocation: "Alleppey",
    duration: "4 Days",
    price: { amount: 8999 },
    totalBookings: 78,
    rating: 4.8,
    status: "active",
  },
  {
    _id: "pkg_3",
    title: "Rajasthan Heritage",
    startLocation: "Jaipur",
    duration: "5 Days",
    price: { amount: 10999 },
    totalBookings: 21,
    rating: 4.4,
    status: "inactive",
  },
  // add more mock objects as needed
];

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-800">{value}</p>
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
}

export default function AdminPackages({ packages = mockPackages }) {
  const navigate = typeof useNavigate === "function" ? useNavigate() : null;
  const [activeTab, setActiveTab] = useState("all"); // all | active | inactive
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [sortBy, setSortBy] = useState("bookings"); // bookings | price | rating

  const filtered = useMemo(() => {
    let list = packages.slice();

    if (activeTab === "active")
      list = list.filter((p) => p.status === "active");
    if (activeTab === "inactive")
      list = list.filter((p) => p.status === "inactive");

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.startLocation.toLowerCase().includes(s) ||
          String(p.price?.amount).includes(s)
      );
    }

    if (sortBy === "bookings")
      list.sort((a, b) => b.totalBookings - a.totalBookings);
    if (sortBy === "price")
      list.sort((a, b) => a.price.amount - b.price.amount);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [packages, activeTab, q, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  function gotoPackage(id) {
    if (navigate) navigate(`/dashboard/admin/packages/${id}`);
    else window.location.href = `/dashboard/admin/packages/${id}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Packages</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                (window.location.href = "/dashboard/admin/packages/add")
              }
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm"
            >
              + Add Tour
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 bg-white rounded-xl shadow-sm p-1 w-full max-w-md">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ].map((t) => (
              <button
                key={t.key}
                className={`flex-1 text-sm font-medium py-2 rounded-lg ${
                  activeTab === t.key
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setActiveTab(t.key);
                  setPage(1);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Packages"
            value={packages.length}
            icon={
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 7v13h18V7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3H8v4h8V3z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatCard
            title="Active Packages"
            value={packages.filter((p) => p.status === "active").length}
            icon={
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatCard
            title="Total Bookings"
            value={packages.reduce((s, p) => s + (p.totalBookings || 0), 0)}
            icon={
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 10h18M3 6h18M3 14h18"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              className="text-sm rounded-md border-gray-200 bg-white p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="bookings">Bookings (desc)</option>
              <option value="price">Price (asc)</option>
              <option value="rating">Rating (desc)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-1/3">
            <input
              type="text"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search packages, location or price..."
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none"
            />
            <button
              onClick={() => {
                setQ("");
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">All Packages</h2>
            <div className="text-sm text-gray-500">
              {filtered.length} packages found
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Package
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Bookings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {pageItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-6 text-center text-sm text-gray-500"
                    >
                      No packages found.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((p) => (
                    <tr key={p._id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-md bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                            IMG
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {p.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {p._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {p.startLocation}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {p.duration}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        ₹{p.price?.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {p.totalBookings}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-800">
                            {p.rating.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">/5</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            title="View"
                            onClick={() => gotoPackage(p._id)}
                            className="p-2 rounded-md hover:bg-gray-100"
                          >
                            <svg
                              className="w-5 h-5 text-gray-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2.5 12s2.8-6 9.5-6 9.5 6 9.5 6-2.8 6-9.5 6S2.5 12 2.5 12z"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>

                          <button
                            title={
                              p.status === "active" ? "Deactivate" : "Activate"
                            }
                            onClick={() => {
                              // In a real app, call API to toggle. Here we show a simple confirm.
                              // (Replace with optimistic UI + API)
                              // eslint-disable-next-line no-alert
                              if (
                                window.confirm(
                                  `Toggle status for "${p.title}"?`
                                )
                              ) {
                                // This mock does nothing to parent data. Integrate with backend or parent state.
                                alert(
                                  "Status toggle would be performed by API call."
                                );
                              }
                            }}
                            className="p-2 rounded-md hover:bg-gray-100"
                          >
                            {p.status === "active" ? (
                              <svg
                                className="w-5 h-5 text-green-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  d="M5 12l4 4L19 6"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 text-red-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  d="M18 6L6 18M6 6l12 12"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border border-gray-200 text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const idx = i + 1;
                  return (
                    <button
                      key={idx}
                      onClick={() => setPage(idx)}
                      className={`w-9 h-9 rounded-md text-sm ${
                        page === idx
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      {idx}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md border border-gray-200 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
