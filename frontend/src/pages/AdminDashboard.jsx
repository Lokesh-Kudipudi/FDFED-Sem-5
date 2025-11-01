import { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import StatsCard from "../components/admin/StatsCard";
import PopularDestinations from "../components/admin/PopularDestinations";
import ChartPreview from "../components/admin/ChartPreview";

/**
 * Props:
 *  - adminAnalytics: {
 *      totalBookings: number|string,
 *      totalRevenue: number|string,
 *      totalCustomers: number|string,
 *      totalHotels: number|string,
 *      populatedResults: [{ item: { mainImage, title }, totalBookings }]
 *    }
 */
export default function AdminDashboard({ adminAnalytics }) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((s) => !s)}
      />
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-16" : ""
        }`}
      >
        <div className="p-6">
          <Topbar
            onToggleSidebar={() =>
              setSidebarCollapsed((s) => !s)
            }
          />

          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Dashboard Overview
          </h1>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
              title="Total Bookings"
              value={adminAnalytics.totalBookings}
              icon="bookings"
            />
            <StatsCard
              title="Total Revenue"
              value={adminAnalytics.totalRevenue}
              icon="revenue"
            />
            <StatsCard
              title="Total Customers"
              value={adminAnalytics.totalCustomers}
              icon="customers"
            />
            <StatsCard
              title="Total Hotels"
              value={adminAnalytics.totalHotels}
              icon="hotels"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Booking Analytics
                </h2>
                <a
                  className="text-sm text-blue-500 hover:underline"
                  href="#"
                >
                  View Details
                </a>
              </div>
              <ChartPreview />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Recent Bookings
                </h2>
                <a
                  className="text-sm text-blue-500 hover:underline"
                  href="#"
                >
                  View All
                </a>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Customer</th>
                    <th className="py-2">Destination</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example static rows — replace with real data */}
                  <tr className="border-t">
                    <td className="py-3">John Doe</td>
                    <td>Paris, France</td>
                    <td>03/07/2025</td>
                    <td>
                      <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-3">Mike Johnson</td>
                    <td>Tokyo, Japan</td>
                    <td>03/05/2025</td>
                    <td>
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Popular Destinations
              </h2>
              <a
                className="text-sm text-blue-500 hover:underline"
                href="#"
              >
                View All
              </a>
            </div>

            <PopularDestinations
              items={adminAnalytics.populatedResults || []}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
