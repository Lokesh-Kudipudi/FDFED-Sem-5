import React, { useState, useEffect } from "react";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

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
    if (window.confirm("Are you sure you want to delete your account?")) {
      alert("Account deleted (placeholder).");
    }
  };

  // === MY TRIPS FUNCTIONS ===
  const handleTripCancel = (id) => {
    // Replace with your API call
    alert(`Trip with ID ${id} cancelled.`);
  };

  // === MAIN CONTENT RENDER ===
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
            <p className="text-gray-600">
              Welcome to your dashboard. Use the sidebar to manage trips, bookings, analytics, and settings.
            </p>
          </div>
        );

      case "my-trips":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">My Trips</h2>
            <p className="text-gray-600 mb-4">Manage and review your trips.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trip cards — replace with dynamic data */}
              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                <h3 className="font-semibold text-lg">Trip Name</h3>
                <p className="text-sm text-gray-500">Status: Confirmed</p>
                <button
                  onClick={() => handleTripCancel(1)}
                  className="mt-3 bg-red-600 text-white text-sm px-4 py-1.5 rounded hover:bg-red-700"
                >
                  Cancel Trip
                </button>
              </div>
            </div>
          </div>
        );

      case "hotel-bookings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Hotel Bookings</h2>
            <p className="text-gray-600 mb-4">
              View and manage your hotel reservations.
            </p>
            <div className="bg-white shadow rounded-lg p-4">
              <p>No bookings found.</p>
            </div>
          </div>
        );

      case "tour-bookings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Tour Bookings</h2>
            <p className="text-gray-600 mb-4">
              Manage your tour and travel packages.
            </p>
            <div className="bg-white shadow rounded-lg p-4">
              <p>No tours available.</p>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Booking Analytics</h2>
            <p className="text-gray-600 mb-6">
              Analyze your bookings and travel data.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg shadow text-center">
                <h3 className="text-blue-700 font-semibold">Total Bookings</h3>
                <p className="text-2xl font-bold mt-2">—</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg shadow text-center">
                <h3 className="text-green-700 font-semibold">Completed</h3>
                <p className="text-2xl font-bold mt-2">—</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg shadow text-center">
                <h3 className="text-yellow-700 font-semibold">Pending</h3>
                <p className="text-2xl font-bold mt-2">—</p>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>

            <div className="max-w-md bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100">
                  Cancel
                </button>
              </div>
            </div>

            <div className="mt-8 bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="text-red-600 font-semibold">Danger Zone</h4>
              <p className="text-gray-700 mt-2 text-sm">
                Deleting your account is irreversible. All your data will be permanently deleted.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-blue-600">Chasing Horizons</h1>
        <span className="text-sm text-gray-600">User Dashboard</span>
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
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
