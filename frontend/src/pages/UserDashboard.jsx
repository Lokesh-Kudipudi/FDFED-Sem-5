import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Overview from "../components/dashboard/user/Overview";
import MyTrips from "../components/dashboard/user/MyTrips";
import HotelBookings from "../components/dashboard/user/HotelBookings";
import TourBookings from "../components/dashboard/user/TourBookings";
import Analytics from "../components/dashboard/user/Analytics";
import Settings from "../components/dashboard/user/Settings";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Replace with your backend call
    // fetch("/user/profile")
    //   .then(res => res.json())
    //   .then(data => setProfile(data));
  }, []);

  // === SETTINGS FUNCTIONS ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = () => {
    // Placeholder for your backend update call
    // fetch("/user/update", { method: "POST", body: JSON.stringify(profile) })
    alert("Profile saved successfully.");
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
  const handleTripCancel = (id) => {
    // Replace with your API call
    alert(`Trip with ID ${id} cancelled.`);
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
            ["analytics", "Booking Analytics"],
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
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "settings" && (
            <Settings
              profile={profile}
              onInputChange={handleInputChange}
              onSaveProfile={handleSaveProfile}
              onDeleteAccount={handleDeleteAccount}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
