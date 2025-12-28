import { useState, useEffect } from "react";
import { useBooking } from "../../hooks/useBooking";
import { FaCalendarAlt, FaUserFriends, FaRegCheckCircle, FaInfoCircle } from "react-icons/fa";

const BookingSection = ({ tour, availableMonths, bookingDetails }) => {
  const { makeBooking, bookingStatus } = useBooking();
  
  // State for form
  const [selectedDate, setSelectedDate] = useState(null);
  const [numGuests, setNumGuests] = useState(1);
  const [guestDetails, setGuestDetails] = useState([{ name: "", age: "", gender: "Male" }]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate discounted price per person
  const pricePerPerson = tour.price.amount - (tour.price.amount * tour.price.discount);

  useEffect(() => {
    // Update total price when guests change
    setTotalPrice(pricePerPerson * numGuests);

    // Adjust guest details array when numGuests changes
    setGuestDetails(prev => {
      const newDetails = [...prev];
      if (numGuests > prev.length) {
        for (let i = prev.length; i < numGuests; i++) {
          newDetails.push({ name: "", age: "", gender: "Male" });
        }
      } else {
        newDetails.splice(numGuests);
      }
      return newDetails;
    });
  }, [numGuests, pricePerPerson]);

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...guestDetails];
    updatedGuests[index][field] = value;
    setGuestDetails(updatedGuests);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select a departure date."); // Replace with better UI alert later
      return;
    }
    
    // Prepare booking payload
    const bookingPayload = {
      startDate: selectedDate.startDate,
      endDate: selectedDate.endDate,
      numGuests,
      guests: guestDetails,
      totalAmount: totalPrice
    };

    makeBooking(tour._id, bookingPayload);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transform transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="bg-[#003366] p-6 text-white text-center">
        <p className="text-sm opacity-80 uppercase tracking-widest font-medium mb-1">Starting From</p>
        <div className="flex justify-center items-baseline gap-2">
          <span className="text-4xl font-bold">
            {tour.price.currency} {pricePerPerson.toLocaleString()}
          </span>
          <span className="text-lg opacity-60 line-through">
            {tour.price.amount.toLocaleString()}
          </span>
        </div>
        <p className="text-xs mt-2 opacity-70">per person</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleBooking} className="space-y-6">
          
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Select Departure
            </label>
            <div className="grid gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {bookingDetails && bookingDetails.length > 0 ? bookingDetails.map((booking, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedDate(booking)}
                  className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${
                    selectedDate === booking 
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" 
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                   <div className="text-sm">
                     <span className="font-semibold text-gray-800">{formatDate(booking.startDate)}</span>
                     <span className="mx-2 text-gray-400">to</span>
                     <span className="text-gray-600">{formatDate(booking.endDate)}</span>
                   </div>
                   {selectedDate === booking && <FaRegCheckCircle className="text-blue-600" />}
                </div>
              )) : (
                <p className="text-sm text-gray-500 italic p-2">No upcoming dates available.</p>
              )}
            </div>
          </div>

          {/* Guest Counter */}
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
               <FaUserFriends className="text-blue-500" /> Travelers
             </label>
             <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-gray-200">
                <button 
                  type="button"
                  className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 text-gray-600 font-bold"
                  onClick={() => setNumGuests(Math.max(1, numGuests - 1))}
                >
                  -
                </button>
                <span className="font-bold text-gray-800">{numGuests} {numGuests === 1 ? 'Guest' : 'Guests'}</span>
                <button 
                  type="button" 
                  className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 text-gray-600 font-bold"
                  onClick={() => setNumGuests(Math.min(10, numGuests + 1))}
                >
                  +
                </button>
             </div>
          </div>

          {/* Guest Details Form */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700">Guest Details</label>
                <span className="text-xs text-blue-500 cursor-pointer flex items-center gap-1">
                  <FaInfoCircle /> Why needed?
                </span>
             </div>
             
             <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
               {guestDetails.map((guest, index) => (
                 <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in">
                   <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                     Guest {index + 1}
                   </p>
                   <div className="space-y-2">
                     <input 
                       type="text" 
                       placeholder="Full Name"
                       className="w-full text-sm p-2 rounded border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                       value={guest.name}
                       onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                       required
                     />
                     <div className="flex gap-2">
                       <input 
                         type="number" 
                         placeholder="Age"
                         className="w-1/3 text-sm p-2 rounded border border-gray-200 focus:border-blue-500 outline-none"
                         value={guest.age}
                         onChange={(e) => handleGuestChange(index, 'age', e.target.value)}
                         required
                         min="1"
                       />
                       <select 
                         className="w-2/3 text-sm p-2 rounded border border-gray-200 focus:border-blue-500 outline-none bg-white"
                         value={guest.gender}
                         onChange={(e) => handleGuestChange(index, 'gender', e.target.value)}
                       >
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                         <option value="Other">Other</option>
                       </select>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-gray-100 pt-4 mt-6">
             <div className="flex justify-between text-sm text-gray-600 mb-1">
               <span>Starting Price x {numGuests}</span>
               <span>{tour.price.currency} {(tour.price.amount * numGuests).toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-sm text-green-600 mb-2">
               <span>Total Savings</span>
               <span>- {tour.price.currency} {(tour.price.amount * tour.price.discount * numGuests).toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-dashed border-gray-200 pt-2">
               <span>Total Amount</span>
               <span>{tour.price.currency} {totalPrice.toLocaleString()}</span>
             </div>
          </div>

          {/* Book Action */}
          <button
            type="submit"
            disabled={bookingStatus.loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-95 flex justify-center items-center gap-2
              ${bookingStatus.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#003366] hover:bg-blue-800 hover:shadow-xl'}`}
          >
            {bookingStatus.loading ? (
              <>
               <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
               Processing
              </>
            ) : "Book Now"}
          </button>
          
          {bookingStatus.error && (
            <p className="text-red-500 text-sm text-center mt-2">{bookingStatus.error}</p>
          )}

        </form>
      </div>
      
      {/* Trust Badges */}
      <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100">
         <span className="flex items-center gap-1"><FaRegCheckCircle className="text-green-500"/> Best Price</span>
         <span className="flex items-center gap-1"><FaRegCheckCircle className="text-green-500"/> Secure Payment</span>
      </div>
    </div>
  );
};

export default BookingSection;
