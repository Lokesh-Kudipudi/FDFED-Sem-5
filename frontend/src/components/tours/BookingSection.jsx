import { useState, } from "react";
import { useBooking } from "../../hooks/useBooking";
import {
  FaCalendarAlt,
  FaUserFriends,
  FaTimes,
  FaCheck,
  FaFilter,
} from "react-icons/fa";
import toast from "react-hot-toast";

const BookingSection = ({ tour, bookingDetails }) => {
  const { makeBooking, bookingStatus } = useBooking();

  const [selectedDate, setSelectedDate] = useState(null);
  const [numGuests, setNumGuests] = useState(1);
  const [guestDetails, setGuestDetails] = useState([]);

  // Modal states
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [monthFilter, setMonthFilter] = useState("All");

  const pricePerPerson =
    tour.price.amount - tour.price.amount * tour.price.discount;
  const totalPrice = pricePerPerson * numGuests;

  // Filter dates by month
  const filteredDates =
    monthFilter === "All"
      ? bookingDetails
      : bookingDetails?.filter((booking) => {
          const startDate = new Date(booking.startDate);
          
          // Filter out past dates (normalize to midnight)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          
          if (startDate < today) return false;

          const month = new Date(booking.startDate).toLocaleString("en-US", {
            month: "long",
          });
          return month === monthFilter;
        });

  // Get unique months
  const uniqueMonths = [
    "All",
    ...new Set(
      bookingDetails
        ?.filter(booking => {
             const startDate = new Date(booking.startDate);
             const today = new Date();
             today.setHours(0, 0, 0, 0);
             startDate.setHours(0, 0, 0, 0);
             return startDate >= today;
        })
        .map((booking) =>
        new Date(booking.startDate).toLocaleString("en-US", { month: "long" })
      ) || []
    ),
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDateSelect = (booking) => {
    setSelectedDate(booking);
    setShowDateModal(false);
    toast.success("Date selected!");
  };

  const handleBookNow = () => {
    if (!selectedDate) {
      toast.error("Please select a departure date");
      return;
    }
    // Initialize guest details
    setGuestDetails(
      Array(numGuests)
        .fill()
        .map(() => ({ name: "", age: "" }))
    );
    setShowDetailsModal(true);
  };

  const handleGuestChange = (index, field, value) => {
    const updated = [...guestDetails];
    updated[index][field] = value;
    setGuestDetails(updated);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();

    // Validate all fields
    const isValid = guestDetails.every((guest) => guest.name && guest.age);
    if (!isValid) {
      toast.error("Please fill all guest details");
      return;
    }

    const bookingPayload = {
      startDate: selectedDate.startDate,
      endDate: selectedDate.endDate,
      numGuests,
      guests: guestDetails,
      totalAmount: totalPrice,
    };

    makeBooking(tour._id, bookingPayload);
    setShowDetailsModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24 animate-fade-in">
        {/* Price Header */}
        <div className="bg-gradient-to-br from-[#003366] to-[#0055aa] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          <p className="text-sm opacity-90 uppercase tracking-widest font-medium mb-2 relative">
            Starting From
          </p>
          <div className="flex justify-center items-baseline gap-3 relative">
            <span className="text-4xl md:text-5xl font-bold">
              {tour.price.currency} {pricePerPerson.toLocaleString()}
            </span>
            {tour.price.discount > 0 && (
              <span className="text-lg opacity-70 line-through">
                {tour.price.amount.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-sm mt-2 opacity-80 relative">per person</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Select Availability Button */}
          <button
            onClick={() => setShowDateModal(true)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-[#003366] rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white group-hover:bg-[#003366] rounded-lg flex items-center justify-center transition-colors shadow-sm">
                <FaCalendarAlt className="text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">Departure</p>
                <p className="text-sm font-bold text-gray-800">
                  {selectedDate
                    ? formatDate(selectedDate.startDate)
                    : "Select Date"}
                </p>
              </div>
            </div>
            {selectedDate && (
              <FaCheck className="text-green-500 animate-fade-in" />
            )}
          </button>

          {/* Number of People */}
          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <FaUserFriends className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Travelers</p>
                <p className="text-sm font-bold text-gray-800">
                  {numGuests} {numGuests === 1 ? "Person" : "People"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNumGuests(Math.max(1, numGuests - 1))}
                className="flex-1 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 font-bold text-gray-700 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold text-[#003366] min-w-[40px] text-center">
                {numGuests}
              </span>
              <button
                onClick={() => {
                    const maxGuests = selectedDate ? selectedDate.availableSlots : 10;
                    if (selectedDate && numGuests >= maxGuests) {
                        toast.error(`Only ${maxGuests} slots available for this date`);
                        return;
                    }
                    setNumGuests(Math.min(maxGuests, numGuests + 1));
                }}
                className={`flex-1 py-2 bg-white border border-gray-200 rounded-lg font-bold text-gray-700 transition-colors ${
                     (selectedDate && numGuests >= selectedDate.availableSlots) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                disabled={selectedDate && numGuests >= selectedDate.availableSlots}
              >
                +
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-transparent p-4 rounded-xl border border-blue-100">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Price × {numGuests}</span>
              <span className="font-semibold">
                {tour.price.currency}{" "}
                {(pricePerPerson * numGuests).toLocaleString()}
              </span>
            </div>
            {tour.price.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mb-3">
                <span>Savings</span>
                <span className="font-semibold">
                  - {tour.price.currency}{" "}
                  {(
                    tour.price.amount *
                    tour.price.discount *
                    numGuests
                  ).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-[#003366] border-t border-blue-200 pt-3">
              <span>Total</span>
              <span>{tour.price.currency} {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Book Now Button */}
          <button
            onClick={handleBookNow}
            className="w-full py-4 bg-gradient-to-r from-[#003366] to-[#0055aa] hover:from-[#002244] hover:to-[#003366] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          >
            Book Now
          </button>

          {/* Trust Badges */}
          <div className="flex justify-around pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FaCheck className="text-green-500" /> Best Price
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FaCheck className="text-green-500" /> Secure
            </span>
          </div>
        </div>
      </div>

      {/* Date Selection Modal */}
      {showDateModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowDateModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#003366] to-[#0055aa] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Select Departure Date</h3>
                <p className="text-sm opacity-90 mt-1">
                  Choose your preferred travel date
                </p>
              </div>
              <button
                onClick={() => setShowDateModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Month Filter */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <FaFilter className="text-gray-400 shrink-0" />
                {uniqueMonths.map((month) => (
                  <button
                    key={month}
                    onClick={() => setMonthFilter(month)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all shrink-0 ${
                      monthFilter === month
                        ? "bg-[#003366] text-white shadow-lg"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates List */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="grid gap-3">
                {filteredDates && filteredDates.length > 0 ? (
                  filteredDates.map((booking, idx) => {
                    const isSoldOut = booking.availableSlots === 0;
                    return (
                    <div
                      key={idx}
                      onClick={() => !isSoldOut && handleDateSelect(booking)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSoldOut 
                        ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-200" 
                        : "cursor-pointer hover:shadow-lg"
                      } ${
                        selectedDate === booking
                          ? "border-[#003366] bg-blue-50 ring-2 ring-blue-200"
                          : !isSoldOut && "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                      style={{ animation: `fadeIn 0.3s ease-out ${idx * 0.05}s backwards` }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-800">
                            {formatDate(booking.startDate)}
                            <span className="mx-2 text-gray-400">→</span>
                            {formatDate(booking.endDate)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {Math.ceil(
                              (new Date(booking.endDate) -
                                new Date(booking.startDate)) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days
                          </p>
                           {/* Availability Status */}
                          <div className="mt-2 text-sm">
                            {booking.availableSlots === 0 ? (
                                <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-full text-xs">
                                    Sold Out
                                </span>
                            ) : (
                                <span className={`${
                                    booking.availableSlots <= 5 ? "text-orange-600" : "text-green-600"
                                } font-medium flex items-center gap-1`}>
                                    {booking.availableSlots <= 5 && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                                    {booking.availableSlots} slots left
                                </span>
                            )}
                          </div>
                      </div>
                        {selectedDate === booking && (
                          <div className="w-8 h-8 bg-[#003366] rounded-full flex items-center justify-center">
                            <FaCheck className="text-white" size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })

                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No dates available for {monthFilter}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Details Modal */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#003366] to-[#0055aa] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Guest Details</h3>
                <p className="text-sm opacity-90 mt-1">
                  Enter details for {numGuests}{" "}
                  {numGuests === 1 ? "traveler" : "travelers"}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitBooking} className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {guestDetails.map((guest, index) => (
                  <div
                    key={index}
                    className="p-5 bg-gradient-to-br from-blue-50 to-transparent rounded-xl border-2 border-blue-100"
                    style={{ animation: `fadeIn 0.3s ease-out ${index * 0.1}s backwards` }}
                  >
                    <p className="text-sm font-bold text-[#003366] mb-3 uppercase tracking-wide flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#003366] text-white rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      Guest {index + 1}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-[#003366] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        value={guest.name}
                        onChange={(e) =>
                          handleGuestChange(index, "name", e.target.value)
                        }
                        required
                      />
                      <input
                        type="number"
                        placeholder="Age"
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-[#003366] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        value={guest.age}
                        onChange={(e) =>
                          handleGuestChange(index, "age", e.target.value)
                        }
                        min="1"
                        max="120"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Price */}
              <div className="mt-6 p-4 bg-gradient-to-r from-[#003366] to-[#0055aa] rounded-xl text-white">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold">
                    {tour.price.currency} {totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm opacity-90 mt-1">
                  {pricePerPerson.toLocaleString()} × {numGuests} travelers
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={bookingStatus.loading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingStatus.loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingSection;
