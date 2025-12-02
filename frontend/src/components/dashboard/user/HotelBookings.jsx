import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HotelBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotelBookings();
  }, []);

  const fetchHotelBookings = async () => {
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
          // Filter only hotel bookings
          const hotelBookings = (data.data || []).filter(
            (booking) => booking.type === "Hotel"
          );
          setBookings(hotelBookings);
        } else {
          setError(
            data.message || "Failed to load hotel bookings"
          );
        }
      } else {
        setError(
          "Failed to load hotel bookings. Please try again later."
        );
      }
    } catch (err) {
      console.error("Error fetching hotel bookings:", err);
      setError(
        "Failed to load hotel bookings. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this hotel booking?"
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
        // Refresh bookings after cancellation
        fetchHotelBookings();
      } else {
        setError(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setError("An error occurred while cancelling the booking");
    }
  };

  // Filter bookings by date
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((booking) => {
    const status = booking?.bookingDetails?.status;
    if (status === "cancel") return false;

    const checkOutStr = booking?.bookingDetails?.checkOut;
    if (!checkOutStr) return true;

    const checkOut = new Date(checkOutStr);
    checkOut.setHours(0, 0, 0, 0);

    return checkOut >= currentDate;
  });

  const pastBookings = bookings.filter((booking) => {
    const status = booking?.bookingDetails?.status;
    if (status === "cancel") return false;

    const checkOutStr = booking?.bookingDetails?.checkOut;
    if (!checkOutStr) return false;

    const checkOut = new Date(checkOutStr);
    checkOut.setHours(0, 0, 0, 0);

    return checkOut < currentDate;
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

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate analytics
  const analytics = {
    total: bookings.length,
    upcoming: upcomingBookings.length,
    past: pastBookings.length,
    pending: bookings.filter(
      (b) => b.bookingDetails?.status === "pending"
    ).length,
    completed: bookings.filter((b) => {
      const checkOutStr = b?.bookingDetails?.checkOut;
      if (!checkOutStr) return false;
      const checkOut = new Date(checkOutStr);
      checkOut.setHours(0, 0, 0, 0);
      return (
        checkOut < currentDate &&
        b.bookingDetails?.status !== "cancel"
      );
    }).length,
    cancelled: bookings.filter(
      (b) => b.bookingDetails?.status === "cancel"
    ).length,
    totalNights: bookings.reduce((sum, b) => {
      if (b.bookingDetails?.status !== "cancel") {
        return (
          sum +
          calculateNights(
            b.bookingDetails?.checkIn,
            b.bookingDetails?.checkOut
          )
        );
      }
      return sum;
    }, 0),
    totalGuests: bookings.reduce((sum, b) => {
      if (b.bookingDetails?.status !== "cancel") {
        return sum + (b.bookingDetails?.guests || 1);
      }
      return sum;
    }, 0),
    uniqueLocations: new Set(
      bookings
        .filter((b) => b.itemId?.location)
        .map((b) => b.itemId.location)
    ).size,
    totalSpent: bookings.reduce((sum, b) => {
      if (b.bookingDetails?.status !== "cancel") {
        return (
          sum +
          (b.bookingDetails?.totalPrice ||
            b.bookingDetails?.price ||
            0)
        );
      }
      return sum;
    }, 0),
    nextStay:
      upcomingBookings.length > 0
        ? upcomingBookings.sort((a, b) => {
            const dateA = new Date(
              a.bookingDetails?.checkIn || a.createdAt
            );
            const dateB = new Date(
              b.bookingDetails?.checkIn || b.createdAt
            );
            return dateA - dateB;
          })[0]
        : null,
  };



  const renderHotelCard = (booking, isUpcoming = true) => {


    return (
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
            {booking.bookingDetails?.checkIn
              ? `Check-in: ${formatDate(
                  booking.bookingDetails.checkIn
                )}`
              : `Booking Date: ${formatDate(booking.createdAt)}`}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {booking.itemId?.title || "Hotel Booking"}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <span>📍</span>
          <span>
            {booking.itemId?.location ||
              "Location not available"}
          </span>
        </div>

        <div className="flex justify-between items-center border-t pt-4 mt-2">
          <div className="text-center">
            <div className="font-semibold text-lg">
              {booking.bookingDetails?.guests || 1}
            </div>
            <div className="text-xs text-gray-500">Guests</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">
              {calculateNights(
                booking.bookingDetails?.checkIn,
                booking.bookingDetails?.checkOut
              )}
            </div>
            <div className="text-xs text-gray-500">Nights</div>
          </div>
          <div className="text-center">
            <div
              className="font-semibold text-lg text-truncate"
              title={
                booking.bookingDetails?.roomType || "Standard"
              }
            >
              {booking.bookingDetails?.roomType?.split(" ")[0] ||
                "Room"}
            </div>
            <div className="text-xs text-gray-500">Type</div>
          </div>
        </div>

        {isUpcoming && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                navigate(`/hotels/hotel/${booking.itemId?._id}`)
              }
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              View Hotel
            </button>
          </div>
        )}

        {!isUpcoming && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() =>
                navigate(`/hotels/hotel/${booking.itemId?._id}`)
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              View Hotel
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              Add Review
            </button>
          </div>
        )}
      </div>
    </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading hotel bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <span className="text-2xl">🏨</span> Hotel Bookings
        </h1>
        <button
          onClick={() => navigate("/hotels")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
        >
          <span className="text-xl">+</span> Book Hotel
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Analytics Section */}
      {!isLoading && bookings.length > 0 && (
        <div className="mb-8">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Bookings Card */}
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">🏨</div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {analytics.total}
                  </div>
                  <div className="text-sm opacity-90">
                    Total Stays
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-cyan-400/30 flex justify-between text-xs">
                <span className="opacity-90">
                  Active: {analytics.upcoming}
                </span>
                <span className="opacity-90">
                  Past: {analytics.past}
                </span>
              </div>
            </div>

            {/* Locations Card */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">🌆</div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {analytics.uniqueLocations}
                  </div>
                  <div className="text-sm opacity-90">
                    Locations
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-pink-400/30 text-xs opacity-90">
                Cities visited
              </div>
            </div>

            {/* Total Nights Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">🌙</div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {analytics.totalNights}
                  </div>
                  <div className="text-sm opacity-90">
                    Total Nights
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-indigo-400/30 text-xs opacity-90">
                {analytics.totalGuests} guests accommodated
              </div>
            </div>

            {/* Total Spent Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">💳</div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ₹{analytics.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">
                    Total Spent
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-400/30 text-xs opacity-90">
                On accommodations
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                  ⏳
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {analytics.pending}
                  </div>
                  <div className="text-xs text-gray-600">
                    Pending
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                  ✅
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {analytics.completed}
                  </div>
                  <div className="text-xs text-gray-600">
                    Completed
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                  ❌
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {analytics.cancelled}
                  </div>
                  <div className="text-xs text-gray-600">
                    Cancelled
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {analytics.total > 0
                      ? Math.round(
                          (analytics.completed /
                            analytics.total) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-gray-600">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Stay Highlight */}
          {analytics.nextStay && (
            <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm opacity-90 mb-1">
                    🏨 Your Next Stay
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    {analytics.nextStay.itemId?.title ||
                      "Hotel Booking"}
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <span>
                      📍{" "}
                      {analytics.nextStay.itemId?.location ||
                        "Location"}
                    </span>
                    <span>
                      📅{" "}
                      {formatDate(
                        analytics.nextStay.bookingDetails
                          ?.checkIn
                      )}
                    </span>
                    <span>
                      🌙{" "}
                      {calculateNights(
                        analytics.nextStay.bookingDetails
                          ?.checkIn,
                        analytics.nextStay.bookingDetails
                          ?.checkOut
                      )}{" "}
                      nights
                    </span>
                    <span>
                      👥{" "}
                      {analytics.nextStay.bookingDetails
                        ?.guests || 1}{" "}
                      guests
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/hotels/hotel/${analytics.nextStay.itemId?._id}`
                    )
                  }
                  className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Hotel Bookings */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span>🕐</span> Upcoming Hotel Stays
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) =>
              renderHotelCard(booking, true)
            )
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">
                🏨
              </div>
              <p className="text-gray-600 text-lg mb-4">
                No upcoming hotel bookings found.
              </p>
              <button
                onClick={() => navigate("/hotels")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Browse Hotels
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Past Hotel Bookings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span>📜</span> Past Hotel Stays
          </h2>
          {pastBookings.length > 0 && (
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) =>
              renderHotelCard(booking, false)
            )
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">
                📜
              </div>
              <p className="text-gray-600 text-lg">
                No past hotel bookings found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelBookings;
