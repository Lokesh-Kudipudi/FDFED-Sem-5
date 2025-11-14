import React from "react";

const Settings = ({
  profile,
  onInputChange,
  onSaveProfile,
  onDeleteAccount,
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Profile Settings
      </h2>

      <div className="max-w-md bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onSaveProfile}
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
        <h4 className="text-red-600 font-semibold">
          Danger Zone
        </h4>
        <p className="text-gray-700 mt-2 text-sm">
          Deleting your account is irreversible. All your data
          will be permanently deleted.
        </p>
        <button
          onClick={onDeleteAccount}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
