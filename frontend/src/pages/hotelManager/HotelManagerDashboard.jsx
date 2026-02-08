import { useState, useEffect } from "react";
import HotelManagerDashboardContent from "../../components/dashboard/hotelManager/HotelManagerDashboard";
import CreateHotelForm from "../../components/dashboard/hotelManager/CreateHotelForm";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import { API } from "../../config/api";

export default function HotelManagerDashboard() {
  const [initialBookings, _setInitialBookings] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(API.MANAGER.MY_HOTEL, {
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hotel) {
    return <CreateHotelForm onHotelCreated={handleHotelCreated} />;
  }

  return (
    <DashboardLayout title="Hotel Manager Dashboard" sidebarItems={hotelManagerSidebarItems}>
      <HotelManagerDashboardContent
        initialBookings={initialBookings}
      />
    </DashboardLayout>
  );
}
