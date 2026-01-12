import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHotel } from "react-icons/fa";

export default function NewHotelManagerModal() {
  const navigate = useNavigate();

  const handleCreateHotel = () => {
    navigate("/hotel-manager/dashboard");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <FaHotel className="text-3xl text-blue-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome, Hotel Manager!
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Your account has been created successfully. Now, let's get your hotel
          listed. Click the button below to create and add your hotel details.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Next Step:</span> Add your hotel
            information to start managing bookings and reaching customers.
          </p>
        </div>

        <button
          onClick={handleCreateHotel}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          Create / Add Hotel
        </button>
      </div>
    </div>
  );
}
