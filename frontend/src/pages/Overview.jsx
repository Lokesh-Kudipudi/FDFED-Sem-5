import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";

const Overview = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllBookingsModal, setShowAllBookingsModal] =
    useState(false);
  const navigate = useNavigate();
  const { state } = useContext(UserContext);

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

  // Separate bookings by type
  const tourBookings = bookings.filter((b) => b.type === "Tour");
  const hotelBookings = bookings.filter(
    (b) => b.type === "Hotel"
  );

  // Calculate date-based status
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const getBookingStatus = (booking) => {
    if (booking.bookingDetails?.status === "cancel")
      return "cancelled";

    const endDateStr =
      booking.type === "Tour"
        ? booking.bookingDetails?.endDate
        : booking.bookingDetails?.checkOut;

    if (!endDateStr) return "upcoming";

    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);

    return endDate < currentDate ? "completed" : "upcoming";
  };

  // Comprehensive analytics
  const analytics = {
    total: bookings.length,
    tours: tourBookings.length,
    hotels: hotelBookings.length,
    upcoming: bookings.filter(
      (b) => getBookingStatus(b) === "upcoming"
    ).length,
    completed: bookings.filter(
      (b) => getBookingStatus(b) === "completed"
    ).length,
    cancelled: bookings.filter(
      (b) => b.bookingDetails?.status === "cancel"
    ).length,
    pending: bookings.filter(
      (b) => b.bookingDetails?.status === "pending"
    ).length,
    totalSpent: bookings.reduce((sum, b) => {
      if (b.bookingDetails?.status !== "cancel") {
        return (
          sum +
          (b.bookingDetails?.totalPrice ||
            b.bookingDetails?.price ||
            b.itemId?.price?.amount ||
            0)
        );
      }
      return sum;
    }, 0),
    totalTourDays: tourBookings.reduce((sum, b) => {
      const days =
        b.itemId?.itinerary?.length ||
        parseInt(b.itemId?.duration?.split(" ")[0]) ||
        0;
      return sum + days;
    }, 0),
    totalHotelNights: hotelBookings.reduce((sum, b) => {
      return (
        sum +
        calculateNights(
          b.bookingDetails?.checkIn,
          b.bookingDetails?.checkOut
        )
      );
    }, 0),
    uniqueDestinations: new Set([
      ...tourBookings
        .filter((b) => b.itemId?.startLocation)
        .map((b) => b.itemId.startLocation),
      ...hotelBookings
        .filter((b) => b.itemId?.location)
        .map((b) => b.itemId.location),
    ]).size,
  };

  // Recent bookings
  const recentBookings = [...bookings]
    .sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  // Next upcoming booking
  const upcomingBookings = bookings
    .filter((b) => getBookingStatus(b) === "upcoming")
    .sort((a, b) => {
      const dateA = new Date(
        a.bookingDetails?.startDate ||
          a.bookingDetails?.checkIn ||
          a.createdAt
      );
      const dateB = new Date(
        b.bookingDetails?.startDate ||
          b.bookingDetails?.checkIn ||
          b.createdAt
      );
      return dateA - dateB;
    });

  const nextBooking = upcomingBookings[0];

  // Monthly booking data for chart
  const monthlyData = {};
  bookings.forEach((booking) => {
    const date = new Date(booking.createdAt);
    const monthYear = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
  });

  const monthlyBookings = Object.entries(monthlyData)
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  // Spending by type
  const tourSpending = tourBookings.reduce((sum, b) => {
    if (b.bookingDetails?.status !== "cancel") {
      return (
        sum +
        (b.bookingDetails?.price || b.itemId?.price?.amount || 0)
      );
    }
    return sum;
  }, 0);

  const hotelSpending = hotelBookings.reduce((sum, b) => {
    if (b.bookingDetails?.status !== "cancel") {
      return (
        sum +
        (b.bookingDetails?.totalPrice ||
          b.bookingDetails?.price ||
          0)
      );
    }
    return sum;
  }, 0);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back,{" "}
          {state.user?.fullName?.split(" ")[0] || "Traveler"}! 👋
        </h1>
        <p className="text-gray-600">
          Here's an overview of your travel journey
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Bookings */}
        <div
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/user/my-trips")}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">📋</div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {analytics.total}
              </div>
              <div className="text-sm opacity-90">
                Total Bookings
              </div>
            </div>
          </div>
          <div className="text-xs opacity-80">
            Click to view all
          </div>
        </div>

        {/* Tours */}
        <div
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/user/tour-bookings")}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">🗺️</div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {analytics.tours}
              </div>
              <div className="text-sm opacity-90">
                Tour Bookings
              </div>
            </div>
          </div>
          <div className="text-xs opacity-80">
            {analytics.totalTourDays} days of adventure
          </div>
        </div>

        {/* Hotels */}
        <div
          className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/user/hotel-bookings")}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">🏨</div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {analytics.hotels}
              </div>
              <div className="text-sm opacity-90">
                Hotel Bookings
              </div>
            </div>
          </div>
          <div className="text-xs opacity-80">
            {analytics.totalHotelNights} nights stayed
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">💰</div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                ₹{analytics.totalSpent.toLocaleString()}
              </div>
              <div className="text-sm opacity-90">
                Total Spent
              </div>
            </div>
          </div>
          <div className="text-xs opacity-80">
            Across all bookings
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-5 shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              🚀
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.upcoming}
              </div>
              <div className="text-sm text-gray-600">
                Upcoming
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.completed}
              </div>
              <div className="text-sm text-gray-600">
                Completed
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
              ⏳
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.pending}
              </div>
              <div className="text-sm text-gray-600">
                Pending
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
              ❌
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.cancelled}
              </div>
              <div className="text-sm text-gray-600">
                Cancelled
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Booking Highlight */}
      {nextBooking && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm opacity-90 mb-1">
                  {nextBooking.type === "Tour"
                    ? "🎉 Next Adventure"
                    : "🏨 Next Hotel Stay"}
                </div>
                <div className="text-2xl font-bold mb-2">
                  {nextBooking.itemId?.title ||
                    `${nextBooking.type} Booking`}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                  <span>
                    📍{" "}
                    {nextBooking.itemId?.startLocation ||
                      nextBooking.itemId?.location ||
                      "Location"}
                  </span>
                  <span>
                    📅{" "}
                    {formatDate(
                      nextBooking.bookingDetails?.startDate ||
                        nextBooking.bookingDetails?.checkIn
                    )}
                  </span>
                  {nextBooking.type === "Tour" && (
                    <span>
                      ⏱️{" "}
                      {nextBooking.itemId?.itinerary?.length ||
                        nextBooking.itemId?.duration?.split(
                          " "
                        )[0] ||
                        "N/A"}{" "}
                      days
                    </span>
                  )}
                  {nextBooking.type === "Hotel" && (
                    <span>
                      🌙{" "}
                      {calculateNights(
                        nextBooking.bookingDetails?.checkIn,
                        nextBooking.bookingDetails?.checkOut
                      )}{" "}
                      nights
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() =>
                  navigate(
                    nextBooking.type === "Tour"
                      ? `/tours/${nextBooking.itemId?._id}`
                      : `/hotels/hotel/${nextBooking.itemId?._id}`
                  )
                }
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charts and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Trend Chart */}
        <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span> Booking Trend (Last 6 Months)
          </h3>
          {monthlyBookings.length > 0 ? (
            <div className="space-y-3">
              {monthlyBookings.map((item, index) => {
                const maxCount = Math.max(
                  ...monthlyBookings.map((b) => b.count)
                );
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {item.month}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {item.count} booking
                        {item.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No booking data available
            </p>
          )}
        </div>

        {/* Spending Breakdown */}
        <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>💳</span> Spending Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  Tours
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{tourSpending.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      analytics.totalSpent > 0
                        ? (tourSpending / analytics.totalSpent) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                  Hotels
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{hotelSpending.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      analytics.totalSpent > 0
                        ? (hotelSpending /
                            analytics.totalSpent) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">
                  Total Spending
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{analytics.totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Average per booking: ₹
                {analytics.total > 0
                  ? Math.round(
                      analytics.totalSpent / analytics.total
                    ).toLocaleString()
                  : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Stats */}
      <div className="bg-white rounded-lg p-6 shadow border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>🌍</span> Your Travel Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {analytics.uniqueDestinations}
            </div>
            <div className="text-sm text-gray-600">
              Destinations Visited
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-1">
              {analytics.totalTourDays}
            </div>
            <div className="text-sm text-gray-600">
              Days on Tours
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600 mb-1">
              {analytics.totalHotelNights}
            </div>
            <div className="text-sm text-gray-600">
              Hotel Nights
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-1">
              {analytics.total > 0
                ? Math.round(
                    (analytics.completed / analytics.total) * 100
                  )
                : 0}
              %
            </div>
            <div className="text-sm text-gray-600">
              Completion Rate
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>📜</span> Recent Bookings
          </h3>
          <button
            onClick={() => setShowAllBookingsModal(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        {recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((booking, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={() =>
                  navigate(
                    booking.type === "Tour"
                      ? `/tours/${booking.itemId?._id}`
                      : `/hotels/hotel/${booking.itemId?._id}`
                  )
                }
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {booking.type === "Tour" ? "🗺️" : "🏨"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {booking.itemId?.title ||
                        `${booking.type} Booking`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.itemId?.startLocation ||
                        booking.itemId?.location ||
                        "Location"}{" "}
                      • {formatDate(booking.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      getBookingStatus(booking) === "upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : getBookingStatus(booking) ===
                          "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {getBookingStatus(booking)}
                  </span>
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✈️</div>
            <p className="text-gray-600 mb-4">No bookings yet</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Start Planning Your Trip
            </button>
          </div>
        )}
      </div>

      {/* All Bookings Modal */}
      {showAllBookingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📋</span> All Bookings ({bookings.length})
              </h2>
              <button
                onClick={() => setShowAllBookingsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition text-3xl leading-none p-2"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6">
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((booking, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer border border-gray-200"
                      onClick={() => {
                        setShowAllBookingsModal(false);
                        navigate(
                          booking.type === "Tour"
                            ? `/tours/${booking.itemId?._id}`
                            : `/hotels/hotel/${booking.itemId?._id}`
                        );
                      }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">
                          {booking.type === "Tour" ? "🗺️" : "🏨"}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {booking.itemId?.title ||
                              `${booking.type} Booking`}
                          </div>
                          <div className="text-sm text-gray-600 flex flex-wrap gap-2 mt-1">
                            <span>
                              📍{" "}
                              {booking.itemId?.startLocation ||
                                booking.itemId?.location ||
                                "Location"}
                            </span>
                            <span>•</span>
                            <span>
                              📅 {formatDate(booking.createdAt)}
                            </span>
                            {booking.type === "Tour" && (
                              <>
                                <span>•</span>
                                <span>
                                  ⏱️{" "}
                                  {booking.itemId?.itinerary
                                    ?.length ||
                                    booking.itemId?.duration?.split(
                                      " "
                                    )[0] ||
                                    "N/A"}{" "}
                                  days
                                </span>
                              </>
                            )}
                            {booking.type === "Hotel" && (
                              <>
                                <span>•</span>
                                <span>
                                  🌙{" "}
                                  {calculateNights(
                                    booking.bookingDetails
                                      ?.checkIn,
                                    booking.bookingDetails
                                      ?.checkOut
                                  )}{" "}
                                  nights
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            💰 ₹
                            {(
                              booking.bookingDetails
                                ?.totalPrice ||
                              booking.bookingDetails?.price ||
                              booking.itemId?.price?.amount ||
                              0
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            getBookingStatus(booking) ===
                            "upcoming"
                              ? "bg-blue-100 text-blue-700"
                              : getBookingStatus(booking) ===
                                "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {getBookingStatus(booking)}
                        </span>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✈️</div>
                  <p className="text-gray-600 mb-4">
                    No bookings yet
                  </p>
                  <button
                    onClick={() => {
                      setShowAllBookingsModal(false);
                      navigate("/");
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Start Planning Your Trip
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                Showing all {bookings.length} booking
                {bookings.length !== 1 ? "s" : ""}
              </div>
              <button
                onClick={() => setShowAllBookingsModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
