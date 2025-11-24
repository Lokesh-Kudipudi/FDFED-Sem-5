import { useState } from "react";
import HotelManagerDashboardContent from "../components/dashboard/hotelManager/HotelManagerDashboard";
import HotelManagerSidebar from "../components/dashboard/hotelManager/HotelManagerSidebar";

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
