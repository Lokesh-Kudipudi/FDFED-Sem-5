import { useState } from "react";
import HotelManagerDashboardContent from "../components/dashboard/hotelManger/HotelManagerDashboard";
import HotelManagerSidebar from "../components/dashboard/hotelManger/HotelManagerSidebar";

export default function HotelManagerDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [initialBookings, setInitialBookings] = useState([]);

  return (
    <div className="flex min-h-screen bg-slate-900">
      <HotelManagerSidebar
        collapsed={sidebarCollapsed}
      />

      <HotelManagerDashboardContent
        initialBookings={initialBookings}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </div>
  );
}
