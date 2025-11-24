import React, { useState, useEffect } from "react";
import {
  FaDownload,
} from "react-icons/fa";
import Sidebar from "../components/dashboard/admin/Sidebar";
import Topbar from "../components/dashboard/admin/Topbar";

const AdminCustomers = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5500/dashboard/api/admin/customers", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        setCustomers(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 p-6 flex flex-col overflow-hidden">
        <Topbar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          collapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">
                  <FaDownload /> Export
                </button>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white shadow-md rounded-lg p-5 overflow-x-auto">
              {loading ? (
                <div className="text-center py-10">Loading customers...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">Error: {error}</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Last Travel</th>
                      <th className="p-3">Bookings</th>
                      <th className="p-3">Amount Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                            {c.fullName
                              ? c.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                              : "U"}
                          </div>
                          <span className="font-medium text-gray-800">{c.fullName}</span>
                        </td>
                        <td className="p-3">{c.email}</td>
                        <td className="p-3">{c.phone || "N/A"}</td>
                        <td className="p-3">{c.lastTravel}</td>
                        <td className="p-3">{c.bookings}</td>
                        <td className="p-3">₹{c.spent?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {!loading && !error && customers.length === 0 && (
                <p className="text-center text-gray-500 py-6">No customers found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCustomers;
