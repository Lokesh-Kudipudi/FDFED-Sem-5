import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { tourGuideSidebarItems } from "../components/dashboard/tourGuide/tourGuideSidebarItems";
import toast from "react-hot-toast";

export default function TourGuideDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5500/dashboard/api/tourGuide/dashboard-stats", {
          credentials: "include",
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout title="Tour Guide Dashboard" sidebarItems={tourGuideSidebarItems}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, Tour Guide!</h1>
        
        {loading ? (
          <div>Loading stats...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Tours</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.totalTours || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Active Bookings</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats?.activeBookings || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                ₹{stats?.totalRevenue || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
