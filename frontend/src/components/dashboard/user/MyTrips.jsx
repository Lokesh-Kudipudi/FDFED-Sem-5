import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyTrips = ({ onTripCancel }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:5500/dashboard/api/bookings",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setBookings(data.data || []);
        } else {
          setError(data.message || "Failed to load bookings");
        }
      } else {
        setError(
          "Failed to load bookings. Please try again later."
        );
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(
        "Failed to load bookings. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    await onTripCancel(bookingId);
    // Refresh bookings after cancellation
    fetchBookings();
  };

  // Filter bookings by status and date
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

  const upcomingBookings = bookings.filter((booking) => {
    const status = booking?.bookingDetails?.status;

    // Exclude cancelled bookings from upcoming
    if (status === "cancel") return false;

    // Get end date based on booking type
    const endDateStr =
      booking.type === "Tour"
        ? booking?.bookingDetails?.endDate
        : booking?.bookingDetails?.checkOut;

    if (!endDateStr) return true; // If no end date, show in upcoming

    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);

    // Show if end date is today or in the future
    return endDate >= currentDate;
  });

  const pastBookings = bookings.filter((booking) => {
    const status = booking?.bookingDetails?.status;

    // Exclude cancelled bookings from past
    if (status === "cancel") return false;

    // Get end date based on booking type
    const endDateStr =
      booking.type === "Tour"
        ? booking?.bookingDetails?.endDate
        : booking?.bookingDetails?.checkOut;

    if (!endDateStr) return false; // If no end date, don't show in past

    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);

    // Show if end date is before today
    return endDate < currentDate;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderTourCard = (booking) => (
    <div
      key={booking._id}
      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 w-full max-w-sm"
    >
      <div className="relative">
        <img
          src={
            booking.itemId?.mainImage ||
            "/images/placeholder.jpg"
          }
          alt={booking.itemId?.title || "Tour"}
          className="w-full h-48 object-cover"
        />

      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <span>📅</span>
          <span>
            {formatDate(booking.bookingDetails?.startDate)} -{" "}
            {formatDate(booking.bookingDetails?.endDate)}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {booking.itemId?.title || "Tour Package"}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <span>📍</span>
          <span>
            {booking.itemId?.startLocation || "Location"}
          </span>
        </div>

        <div className="flex justify-between items-center border-t pt-4 mt-2">
          <div className="text-center">
            <div className="font-semibold text-lg">
              {booking.itemId?.duration || "N/A"}
            </div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">
              {booking.bookingDetails?.travelers || 1}
            </div>
            <div className="text-xs text-gray-500">
              Travelers
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">
              ₹
              {booking.bookingDetails?.price ||
                booking.itemId?.price?.amount ||
                0}
            </div>
            <div className="text-xs text-gray-500">Price</div>
          </div>
        </div>

        {(booking.bookingDetails?.status === "upcoming" ||
          booking.bookingDetails?.status === "pending") && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() =>
                navigate(`/tours/${booking.itemId?._id}`)
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              View Details
            </button>
            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderHotelCard = (booking) => (
    <div
      key={booking._id}
      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 w-full max-w-sm"
    >
      <div className="relative">
        <img
          src={
            booking.itemId?.mainImage ||
            "/images/placeholder.jpg"
          }
          alt={booking.itemId?.title || "Hotel"}
          className="w-full h-48 object-cover"
        />

      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <span>📅</span>
          <span>
            {formatDate(booking.bookingDetails?.checkIn)} -{" "}
            {formatDate(booking.bookingDetails?.checkOut)}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {booking.itemId?.title || "Hotel Booking"}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <span>📍</span>
          <span>{booking.itemId?.location || "Location"}</span>
        </div>

        {(booking.bookingDetails?.status === "upcoming" ||
          booking.bookingDetails?.status === "pending") && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() =>
                navigate(`/hotels/hotel/${booking.itemId?._id}`)
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              📄 View Details
            </button>
            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              ❌ Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Bookings
        </h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
        >
          <span className="text-xl">+</span> Plan New
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Upcoming Bookings */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Upcoming
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) =>
              booking.type === "Tour"
                ? renderTourCard(booking)
                : renderHotelCard(booking)
            )
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">
                📅
              </div>
              <p className="text-gray-600 text-lg">
                No upcoming bookings found.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Explore tours and hotels →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Past Bookings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Past
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) =>
              booking.type === "Tour"
                ? renderTourCard(booking)
                : renderHotelCard(booking)
            )
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">
                📜
              </div>
              <p className="text-gray-600 text-lg">
                No past bookings found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
