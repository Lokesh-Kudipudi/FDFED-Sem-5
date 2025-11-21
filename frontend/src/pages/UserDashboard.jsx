import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import Overview from "../components/dashboard/user/Overview";
import MyTrips from "../components/dashboard/user/MyTrips";
import HotelBookings from "../components/dashboard/user/HotelBookings";
import TourBookings from "../components/dashboard/user/TourBookings";
import Settings from "../components/dashboard/user/Settings";

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
      alert("Account deleted (placeholder).");
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/images/logo.png"
            alt="Chasing Horizons Logo"
            className="h-10 w-10"
          />
          <h1 className="text-xl font-semibold text-black">
            Chasing Horizons
          </h1>
        </div>
        <span className="text-sm text-gray-600">
          User Dashboard
        </span>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200 p-4">
          {[
            ["overview", "Overview"],
            ["my-trips", "My Trips"],
            ["hotel-bookings", "Hotel Bookings"],
            ["tour-bookings", "Tour Bookings"],
            ["settings", "Settings"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition ${
                activeTab === key
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto">
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
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
