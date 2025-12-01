import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TourBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTourBookings();
  }, []);

  const fetchTourBookings = async () => {
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
          // Filter only tour bookings
          const tourBookings = (data.data || []).filter(
            (booking) => booking.type === "Tour"
          );
          setBookings(tourBookings);
        } else {
          setError(
            data.message || "Failed to load tour bookings"
          );
        }
      } else {
        setError(
          "Failed to load tour bookings. Please try again later."
        );
      }
    } catch (err) {
      console.error("Error fetching tour bookings:", err);
      setError(
        "Failed to load tour bookings. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this tour booking?"
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
        fetchTourBookings();
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

    const endDateStr = booking?.bookingDetails?.endDate;
    if (!endDateStr) return true;

    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);

    return endDate >= currentDate;
  });

  const pastBookings = bookings.filter((booking) => {
    const status = booking?.bookingDetails?.status;
    if (status === "cancel") return false;

    const endDateStr = booking?.bookingDetails?.endDate;
    if (!endDateStr) return false;

    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);

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

  // Calculate analytics
  const analytics = {
    total: bookings.length,
    upcoming: upcomingBookings.length,
    past: pastBookings.length,
    pending: bookings.filter(
      (b) => b.bookingDetails?.status === "pending"
    ).length,
    completed: bookings.filter((b) => {
      const endDateStr = b?.bookingDetails?.endDate;
      if (!endDateStr) return false;
      const endDate = new Date(endDateStr);
      endDate.setHours(0, 0, 0, 0);
      return (
        endDate < currentDate &&
        b.bookingDetails?.status !== "cancel"
      );
    }).length,
    cancelled: bookings.filter(
      (b) => b.bookingDetails?.status === "cancel"
    ).length,
    totalDestinations: new Set(
      bookings
        .filter((b) => b.itemId?.startLocation)
        .map((b) => b.itemId.startLocation)
    ).size,
    totalDays: bookings.reduce((sum, b) => {
      const days =
        b.itemId?.itinerary?.length ||
        parseInt(b.itemId?.duration?.split(" ")[0]) ||
        0;
      return sum + days;
    }, 0),
    totalActivities: bookings.reduce((sum, b) => {
      if (b.itemId?.itinerary) {
        return (
          sum +
          b.itemId.itinerary.reduce(
            (count, day) =>
              count + (day.activities?.length || 0),
            0
          )
        );
      }
      return sum;
    }, 0),
    totalSpent: bookings.reduce((sum, b) => {
      if (b.bookingDetails?.status !== "cancel") {
        return (
          sum +
          (b.bookingDetails?.price ||
            b.itemId?.price?.amount ||
            0)
        );
      }
      return sum;
    }, 0),
    nextTrip:
      upcomingBookings.length > 0
        ? upcomingBookings.sort((a, b) => {
            const dateA = new Date(
              a.bookingDetails?.startDate || a.createdAt
            );
            const dateB = new Date(
              b.bookingDetails?.startDate || b.createdAt
            );
            return dateA - dateB;
          })[0]
        : null,
  };

  const getBookingStatus = (booking) => {
    const status = booking.bookingDetails?.status;
    if (status === "pending") return { label: "Pending", color: "bg-yellow-500" };
    if (status === "cancel") return { label: "Cancelled", color: "bg-red-500" };

    const startDateStr = booking.bookingDetails?.startDate;
    const endDateStr = booking.bookingDetails?.endDate;
    
    if (!startDateStr || !endDateStr) return { label: "Unknown", color: "bg-gray-500" };

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const now = new Date();
    
    // Reset hours for accurate date comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (now < start) return { label: "Upcoming", color: "bg-blue-600" };
    if (now >= start && now <= end) return { label: "Ongoing", color: "bg-green-600" };
    return { label: "Completed", color: "bg-gray-600" };
  };

  const renderTourCard = (booking, isUpcoming = true) => {
    const status = getBookingStatus(booking);
    
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
          alt={booking.itemId?.title || "Tour"}
          className="w-full h-48 object-cover"
        />
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${status.color}`}
        >
          {status.label}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <span>📅</span>
          <span>
            {booking.bookingDetails?.startDate
              ? `Start Date: ${formatDate(
                  booking.bookingDetails.startDate
                )}`
              : `Booking Date: ${formatDate(booking.createdAt)}`}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {booking.itemId?.title || "Tour Booking"}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <span>📍</span>
          <span>
            {booking.itemId?.startLocation ||
              booking.itemId?.location ||
              "Location not available"}
          </span>
        </div>

        <div className="flex justify-between items-center border-t pt-4 mt-2">
          <div className="text-center">
            <div className="font-semibold text-lg">
              {booking.itemId?.itinerary?.length ||
                booking.itemId?.duration?.split(" ")[0] ||
                "N/A"}
            </div>
            <div className="text-xs text-gray-500">Days</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">
              {booking.itemId?.destinations?.length || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              Destinations
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">
              {booking.itemId?.itinerary?.reduce(
                (count, day) =>
                  count + (day.activities?.length || 0),
                0
              ) || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              Activities
            </div>
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
                navigate(`/tours/${booking.itemId?._id}`)
              }
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              View Tour
            </button>
          </div>
        )}

        {!isUpcoming && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() =>
                navigate(`/tours/${booking.itemId?._id}`)
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              View Tour
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
            Loading tour bookings...
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
          <span className="text-2xl">🗺️</span> Tour Bookings
        </h1>
        <button
          onClick={() => navigate("/tours")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
        >
          <span className="text-xl">+</span> Book Tour
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
            {/* Total Tours Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">🎯</div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {analytics.total}
                  </div>
                  <div className="text-sm opacity-90">
                    Total Tours
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-400/30 flex justify-between text-xs">
                <span className="opacity-90">
                  Active: {analytics.upcoming}
                </span>
                <span className="opacity-90">
                  Past: {analytics.past}
                </span>
              </div>
            </div>

            {/* Destinations Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">🌍</div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {analytics.totalDestinations}
                  </div>
                  <div className="text-sm opacity-90">
                    Destinations
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-400/30 text-xs opacity-90">
                Unique places explored
              </div>
            </div>

            {/* Total Days Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">📅</div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {analytics.totalDays}
                  </div>
                  <div className="text-sm opacity-90">
                    Total Days
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-orange-400/30 text-xs opacity-90">
                {analytics.totalActivities} activities
                experienced
              </div>
            </div>

            {/* Total Spent Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl">💰</div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ₹{analytics.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">
                    Total Spent
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-green-400/30 text-xs opacity-90">
                Across all bookings
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

          {/* Next Trip Highlight */}
          {analytics.nextTrip && (
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm opacity-90 mb-1">
                    🎉 Your Next Adventure
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    {analytics.nextTrip.itemId?.title ||
                      "Tour Booking"}
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <span>
                      📍{" "}
                      {analytics.nextTrip.itemId
                        ?.startLocation || "Location"}
                    </span>
                    <span>
                      📅{" "}
                      {formatDate(
                        analytics.nextTrip.bookingDetails
                          ?.startDate
                      )}
                    </span>
                    <span>
                      ⏱️{" "}
                      {analytics.nextTrip.itemId?.itinerary
                        ?.length ||
                        analytics.nextTrip.itemId?.duration?.split(
                          " "
                        )[0] ||
                        "N/A"}{" "}
                      days
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/tours/${analytics.nextTrip.itemId?._id}`
                    )
                  }
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Tour Bookings */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span>🕐</span> Upcoming Tours
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) =>
              renderTourCard(booking, true)
            )
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">
                🗺️
              </div>
              <p className="text-gray-600 text-lg mb-4">
                No upcoming tour bookings found.
              </p>
              <button
                onClick={() => navigate("/tours")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Browse Tours
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Past Tour Bookings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span>📜</span> Past Tours
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
              renderTourCard(booking, false)
            )
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">
                📜
              </div>
              <p className="text-gray-600 text-lg">
                No past tour bookings found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourBookings;
