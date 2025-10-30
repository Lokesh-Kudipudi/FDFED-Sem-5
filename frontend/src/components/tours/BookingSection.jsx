import { useState } from "react";
import { useBooking } from "../../hooks/useBooking";

const BookingSection = ({
  tour,
  availableMonths,
  bookingDetails,
}) => {
  const { makeBooking, bookingStatus } = useBooking();
  const [selectedMonth, setSelectedMonth] = useState(
    "Upcoming departures"
  );

  const handleBookingClick = (booking) => {
    makeBooking(tour._id, {
      startDate: booking.startDate,
      endDate: booking.endDate,
    });
  };

  const formatPrice = (price, discount) => {
    const discountedPrice = price - discount * price;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(discountedPrice);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (bookingStatus.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section
      id="choice-section"
      className="mt-16 max-w-4xl mx-auto px-4"
    >
      <h2 className="text-2xl font-bold mb-6">
        Select a departure month
      </h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5 max-w-[600px]">
        <button
          className={`px-3 py-2.5 border rounded text-sm transition-colors
            ${
              selectedMonth === "Upcoming departures"
                ? "bg-gray-800 text-white font-bold"
                : "bg-white hover:bg-gray-100"
            }`}
          onClick={() => setSelectedMonth("Upcoming departures")}
        >
          Upcoming departures
        </button>

        {availableMonths.map((month, index) => (
          <button
            key={index}
            className={`px-3 py-2.5 border rounded text-sm transition-colors
              ${
                selectedMonth === month
                  ? "bg-gray-800 text-white font-bold"
                  : "bg-white hover:bg-gray-100"
              }`}
            onClick={() => setSelectedMonth(month)}
          >
            {month}
          </button>
        ))}
      </div>

      {bookingStatus.error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {bookingStatus.error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {bookingDetails
          .filter(
            (booking) =>
              selectedMonth === "Upcoming departures" ||
              new Date(booking.startDate).toLocaleString(
                "default",
                { month: "long" }
              ) === selectedMonth
          )
          .map((booking, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-lg w-full transition-shadow hover:shadow-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-gray-500">
                      {new Date(
                        booking.startDate
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </div>
                    <div className="text-lg font-bold">
                      {formatDate(booking.startDate)}
                    </div>
                  </div>
                  <span className="text-lg">➡</span>
                  <div>
                    <div className="text-sm text-gray-500">
                      {new Date(
                        booking.endDate
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </div>
                    <div className="text-lg font-bold">
                      {formatDate(booking.endDate)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm line-through text-gray-500">
                    {tour.price.currency} {tour.price.amount}
                  </div>
                  <div className="text-lg font-bold">
                    {formatPrice(
                      tour.price.amount,
                      tour.price.discount
                    )}
                  </div>
                  <button
                    onClick={() => handleBookingClick(booking)}
                    disabled={bookingStatus.loading}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 
                      text-white px-4 py-2 rounded transition-colors"
                  >
                    {bookingStatus.loading
                      ? "Processing..."
                      : "Book Now"}
                  </button>
                </div>
              </div>

              <div className="py-3 border-b">
                <span className="text-sm text-gray-600">
                  🌐 {tour.language || "English"}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-amber-500">🪑</span>
                <span className="text-sm text-amber-500">
                  {booking.seatsAvailable
                    ? `${booking.seatsAvailable} seats left`
                    : "Limited availability"}
                </span>
              </div>
            </div>
          ))}
      </div>

      {bookingDetails.length === 0 && (
        <div className="mt-6 p-4 bg-gray-100 text-gray-700 rounded-lg text-center">
          No departures available for the selected month.
        </div>
      )}
    </section>
  );
};

export default BookingSection;
