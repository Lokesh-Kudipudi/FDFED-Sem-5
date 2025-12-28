import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaTimes, FaTrash, FaCamera, FaCheckCircle, FaShieldAlt, FaBell } from "react-icons/fa";

const Settings = ({
  profile,
  onInputChange,
  onSaveProfile,
  onDeleteAccount,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-3 flex items-center gap-3">
            <span className="bg-blue-50 p-2 rounded-xl text-3xl">⚙️</span> Account Settings
          </h1>
          <p className="text-gray-500 text-lg">Manage your profile, preferences, and security settings.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 font-bold text-sm transition-all relative ${activeTab === "profile" ? "text-[#003366]" : "text-gray-400 hover:text-gray-600"}`}
        >
          Profile Information
          {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003366]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("preferences")}
          className={`px-6 py-3 font-bold text-sm transition-all relative ${activeTab === "preferences" ? "text-[#003366]" : "text-gray-400 hover:text-gray-600"}`}
        >
          Preferences
          {activeTab === "preferences" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003366]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("security")}
          className={`px-6 py-3 font-bold text-sm transition-all relative ${activeTab === "security" ? "text-[#003366]" : "text-gray-400 hover:text-gray-600"}`}
        >
          Security
          {activeTab === "security" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003366]"></div>}
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 text-center sticky top-24">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-[#003366] to-[#0055aa] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl mx-auto">
                  {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-3 rounded-full shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-all">
                  <FaCamera className="text-[#003366]" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.fullName || "User"}</h3>
              <p className="text-sm text-gray-500 mb-6">{profile.email}</p>
              
              <div className="space-y-3 text-left border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-bold text-gray-800">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Bookings</span>
                  <span className="font-bold text-[#003366]">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Account Status</span>
                  <span className="flex items-center gap-1 text-green-600 font-bold"><FaCheckCircle /> Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
            
            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaUser className="text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={onInputChange}
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all bg-gray-50 group-hover:bg-white"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                disabled={true}
                value={profile.email}
                className="w-full border-2 border-gray-200 rounded-xl p-4 bg-gray-100 cursor-not-allowed text-gray-500"
                placeholder="email@example.com"
              />
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <FaShieldAlt /> Email cannot be changed for security reasons
              </p>
            </div>

            {/* Phone */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaPhone className="text-gray-400" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={onInputChange}
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all bg-gray-50 group-hover:bg-white"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* Address */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" /> Address
              </label>
              <textarea
                name="address"
                value={profile.address}
                onChange={onInputChange}
                rows="3"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all bg-gray-50 group-hover:bg-white resize-none"
                placeholder="Enter your complete address"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                onClick={onSaveProfile}
                disabled={isLoading}
                className="flex-1 bg-[#003366] text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
              <button
                disabled={isLoading}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 max-w-3xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaBell className="text-[#003366]" /> Notification Preferences
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div>
                <h4 className="font-bold text-gray-800">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive booking confirmations and updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003366]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div>
                <h4 className="font-bold text-gray-800">Promotional Offers</h4>
                <p className="text-sm text-gray-500">Get exclusive deals and travel inspiration</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003366]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div>
                <h4 className="font-bold text-gray-800">SMS Alerts</h4>
                <p className="text-sm text-gray-500">Receive important updates via text message</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003366]"></div>
              </label>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4">Travel Preferences</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#003366] cursor-pointer transition-all">
                <span className="text-2xl mb-2 block">🏖️</span>
                <span className="text-sm font-bold">Beach</span>
              </div>
              <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#003366] cursor-pointer transition-all">
                <span className="text-2xl mb-2 block">🏔️</span>
                <span className="text-sm font-bold">Mountains</span>
              </div>
              <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#003366] cursor-pointer transition-all">
                <span className="text-2xl mb-2 block">🏛️</span>
                <span className="text-sm font-bold">Cultural</span>
              </div>
              <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#003366] cursor-pointer transition-all">
                <span className="text-2xl mb-2 block">🎢</span>
                <span className="text-sm font-bold">Adventure</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-8 max-w-3xl">
          
          {/* Change Password */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaShieldAlt className="text-[#003366]" /> Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all bg-gray-50"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all bg-gray-50"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all bg-gray-50"
                  placeholder="Confirm new password"
                />
              </div>
              <button className="bg-[#003366] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg">
                Update Password
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-[2rem] shadow-xl shadow-red-200/40 border-2 border-red-100">
            <h3 className="text-2xl font-bold text-red-600 mb-3 flex items-center gap-2">
              <FaTrash /> Danger Zone
            </h3>
            <p className="text-gray-700 mb-6">
              Deleting your account is <strong>irreversible</strong>. All your data, bookings, and preferences will be permanently removed from our system.
            </p>
            <button
              onClick={onDeleteAccount}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <FaTrash /> Delete My Account
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
