import React, { useState } from "react";
import {
  FaPlus,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaFilter,
} from "react-icons/fa";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      membership: "Platinum",
      status: "Active",
      lastTravel: "Mar 1, 2025",
      bookings: 15,
      spent: "$12,450",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@example.com",
      phone: "+1 (555) 987-6543",
      membership: "Gold",
      status: "Active",
      lastTravel: "Feb 15, 2025",
      bookings: 12,
      spent: "$8,790",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+1 (555) 234-5678",
      membership: "Silver",
      status: "Active",
      lastTravel: "Feb 28, 2025",
      bookings: 8,
      spent: "$5,620",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      phone: "+1 (555) 876-5432",
      membership: "Platinum",
      status: "Active",
      lastTravel: "Mar 5, 2025",
      bookings: 18,
      spent: "$14,380",
    },
  ]);

  const [filters, setFilters] = useState({
    status: "",
    membership: "",
  });

  const filteredCustomers = customers.filter(
    (c) =>
      (filters.status === "" ||
        c.status.toLowerCase() === filters.status.toLowerCase()) &&
      (filters.membership === "" ||
        c.membership.toLowerCase() === filters.membership.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="px-8 py-6 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <FaPlus /> Add New Customer
          </button>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-5">
        <h2 className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-4">
          <FaFilter /> Filter Customers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Membership
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={filters.membership}
              onChange={(e) =>
                setFilters({ ...filters, membership: e.target.value })
              }
            >
              <option value="">All Memberships</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow-md rounded-lg p-5 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Membership</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Travel</th>
              <th className="p-3">Bookings</th>
              <th className="p-3">Amount Spent</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="font-medium text-gray-800">{c.name}</span>
                </td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      c.membership === "Platinum"
                        ? "bg-purple-100 text-purple-700"
                        : c.membership === "Gold"
                        ? "bg-yellow-100 text-yellow-700"
                        : c.membership === "Silver"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {c.membership}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3">{c.lastTravel}</td>
                <td className="p-3">{c.bookings}</td>
                <td className="p-3">{c.spent}</td>
                <td className="p-3 flex justify-end gap-2">
                  <button className="p-2 hover:bg-blue-100 rounded">
                    <FaEye className="text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-yellow-100 rounded">
                    <FaEdit className="text-yellow-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 hover:bg-red-100 rounded"
                  >
                    <FaTrash className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <p className="text-center text-gray-500 py-6">No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
