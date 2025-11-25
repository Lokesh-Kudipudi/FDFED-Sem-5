import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import Overview from "../components/dashboard/user/Overview";
import MyTrips from "../components/dashboard/user/MyTrips";
import HotelBookings from "../components/dashboard/user/HotelBookings";
import TourBookings from "../components/dashboard/user/TourBookings";
import Settings from "../components/dashboard/user/Settings";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from context into profile state
    if (state.user) {
      setProfile({
        fullName: state.user.fullName || "",
        email: state.user.email || "",
        phone: state.user.phone || "",
        address: state.user.address || "",
      });
    }
  }, [state.user]);

  // === SETTINGS FUNCTIONS ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5500/dashboard/settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(profile),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Update the user context with new data
        dispatch({ type: "UPDATE_USER", payload: data.user });
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    // Placeholder for delete account API
    if (
      window.confirm(
        "Are you sure you want to delete your account?"
      )
    ) {
      toast.success("Account deleted (placeholder).");
    }
  };

  // === MY TRIPS FUNCTIONS ===
  const handleTripCancel = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5500/dashboard/api/bookings/cancel/${bookingId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        toast.success("Booking cancelled successfully!");
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(
        "An error occurred while cancelling the booking"
      );
    }
  };

  const sidebarItems = [
    { key: "overview", label: "Overview" },
    { key: "my-trips", label: "My Trips" },
    { key: "hotel-bookings", label: "Hotel Bookings" },
    { key: "tour-bookings", label: "Tour Bookings" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <DashboardLayout
      title="User Dashboard"
      sidebarItems={sidebarItems}
      activeItem={activeTab}
      onItemClick={setActiveTab}
    >
      {activeTab === "overview" && <Overview />}
      {activeTab === "my-trips" && (
        <MyTrips onTripCancel={handleTripCancel} />
      )}
      {activeTab === "hotel-bookings" && <HotelBookings />}
      {activeTab === "tour-bookings" && <TourBookings />}
      {activeTab === "settings" && (
        <Settings
          profile={profile}
          onInputChange={handleInputChange}
          onSaveProfile={handleSaveProfile}
          onDeleteAccount={handleDeleteAccount}
          isLoading={isLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
