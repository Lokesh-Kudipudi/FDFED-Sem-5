import { useState, useEffect } from "react";
import HotelManagerDashboardContent from "../components/dashboard/hotelManager/HotelManagerDashboard";
import HotelManagerSidebar from "../components/dashboard/hotelManager/HotelManagerSidebar";
import CreateHotelForm from "../components/dashboard/hotelManager/CreateHotelForm";
import toast from "react-hot-toast";

export default function HotelManagerDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [initialBookings, setInitialBookings] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch("http://localhost:5500/hotels/my-hotel", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.status === "success" && data.data) {
          setHotel(data.data);
        }
      } catch (error) {
        console.error("Error fetching hotel:", error);
        toast.error("Failed to fetch hotel information");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, []);

  const handleHotelCreated = (newHotel) => {
    setHotel(newHotel);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (!hotel) {
    return <CreateHotelForm onHotelCreated={handleHotelCreated} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <HotelManagerSidebar collapsed={sidebarCollapsed} />

      <HotelManagerDashboardContent
        initialBookings={initialBookings}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </div>
  );
}
