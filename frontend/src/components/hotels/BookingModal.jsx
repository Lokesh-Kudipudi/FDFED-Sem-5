import { useState } from "react";
import { FaTimes, FaCalendarAlt, FaUser, FaInfoCircle, FaCheck, FaChevronRight, FaMapMarkerAlt } from "react-icons/fa";
import BookingCalendar from "../../components/BookingCalendar";

const BookingModal = ({ 
  showBookingModal, 
  setShowBookingModal, 
  item, 
  selectedRoom, 
  bookedDates, 
  loadingBookedDates,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  numGuests,
  setNumGuests,
  guestDetails,
  handleGuestInputChange,
  bookingStep,
  setBookingStep,
  nextStep,
  confirmBooking,
  bookingStatus
}) => {
  if (!showBookingModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#003366]/30 backdrop-blur-md p-4 animate-fade-in">
       <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
          
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#003366] to-[#001a33] p-8 text-white flex justify-between items-start shrink-0">
             <div>
               <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Booking Request</p>
               <h2 className="text-2xl font-serif font-bold">{selectedRoom?.title}</h2>
               <p className="text-white/80 text-sm mt-1 flex items-center gap-2"><FaMapMarkerAlt /> {item?.location}</p>
             </div>
             <button onClick={() => setShowBookingModal(false)} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors backdrop-blur-sm"><FaTimes /></button>
          </div>

          {/* Progress Steps Visual */}
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 overflow-x-auto no-scrollbar">
             {[
                { id: 1, label: "Dates", icon: FaCalendarAlt },
                { id: 2, label: "Guests", icon: FaUser },
                { id: 3, label: "Details", icon: FaInfoCircle },
                { id: 4, label: "Payment", icon: FaCheck }
             ].map((step) => (
               <div key={step.id} className={`flex items-center gap-2 ${step.id === bookingStep ? "text-[#003366]" : step.id < bookingStep ? "text-green-600" : "text-gray-300"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step.id === bookingStep ? "bg-[#003366] text-white ring-4 ring-blue-100" : step.id < bookingStep ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}>
                     {step.id < bookingStep ? <FaCheck /> : <step.icon />}
                  </div>
                  <span className="font-bold text-sm hidden sm:block">{step.label}</span>
                  {step.id < 4 && <div className="w-8 h-[2px] bg-gray-200 mx-2 hidden sm:block"></div>}
               </div>
             ))}
          </div>

          {/* Step Content */}
          <div className="p-8 overflow-y-auto flex-grow bg-white">
             
             {/* STEP 1: DATES */}
             {bookingStep === 1 && (
               <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003366] text-xl"><FaCalendarAlt /></div>
                     <div>
                        <h3 className="text-xl font-bold text-gray-900">When are you staying?</h3>
                        <p className="text-gray-500 text-sm">Select your check-in and check-out dates. {loadingBookedDates && <span className="text-blue-500 animate-pulse ml-2">Loading availability...</span>}</p>
                     </div>
                  </div>
                  
                  <BookingCalendar 
                    bookedDates={bookedDates}
                    initialStartDate={checkIn}
                    initialEndDate={checkOut}
                    onChange={(start, end) => {
                        // Convert Dates to YYYY-MM-DD
                         if (start) {
                             // Offset timezone issue by using local date string format carefully or simply
                             const year = start.getFullYear();
                             const month = String(start.getMonth() + 1).padStart(2, '0');
                             const day = String(start.getDate()).padStart(2, '0');
                             setCheckIn(`${year}-${month}-${day}`);
                         } else {
                             setCheckIn("");
                         }
                         
                         if (end) {
                             const year = end.getFullYear();
                             const month = String(end.getMonth() + 1).padStart(2, '0');
                             const day = String(end.getDate()).padStart(2, '0');
                             setCheckOut(`${year}-${month}-${day}`);
                         } else {
                             setCheckOut("");
                         }
                    }}
                  />
                  
                  {(checkIn && checkOut) && (
                      <div className="bg-blue-50 text-[#003366] px-6 py-4 rounded-xl flex items-center justify-between text-sm font-bold border border-blue-100 animate-slide-up">
                          <span>Selected: {checkIn} to {checkOut}</span>
                          <span className="bg-white px-3 py-1 rounded-full text-xs box-shadow-sm border border-blue-100">
                              {Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} Nights
                          </span>
                      </div>
                  )}

               </div>
             )}

             {/* STEP 2: NUMBER OF GUESTS */}
             {bookingStep === 2 && (
               <div className="space-y-6 text-center animate-fade-in py-8">
                  <h3 className="text-2xl font-bold text-gray-900 font-serif">Who is coming with you?</h3>
                  <p className="text-gray-500">Including children above 2 years.</p>
                  
                  <div className="flex justify-center items-center gap-8 my-10">
                     <button 
                       onClick={() => setNumGuests(Math.max(1, numGuests - 1))}
                       className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 hover:border-[#003366] hover:text-[#003366] transition-all"
                     >-</button>
                     <div className="text-center">
                        <span className="text-6xl font-bold text-[#003366] block">{numGuests}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guests</span>
                     </div>
                     <button 
                       onClick={() => setNumGuests(numGuests + 1)}
                       className="w-16 h-16 rounded-full bg-[#003366] text-white flex items-center justify-center text-2xl font-bold hover:bg-blue-900 shadow-xl shadow-blue-900/20 transition-all"
                     >+</button>
                  </div>
               </div>
             )}

             {/* STEP 3: GUEST DETAILS */}
             {bookingStep === 3 && (
               <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-4 mb-2">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003366] text-xl"><FaUser /></div>
                     <div>
                        <h3 className="text-xl font-bold text-gray-900">Guest Details</h3>
                        <p className="text-gray-500 text-sm">We need this for your reservation.</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                  {Array.from({ length: numGuests }).map((_, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-gray-300 transition-colors">
                       <h4 className="font-bold text-xs text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px]">{i + 1}</span> 
                          Guest Information
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">Full Name</label>
                            <input 
                              placeholder="e.g. John Doe" 
                              value={guestDetails[i]?.name || ""} 
                              onChange={e => handleGuestInputChange(i, "name", e.target.value)}
                              className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">Age</label>
                            <input 
                              placeholder="25" 
                              type="number"
                              value={guestDetails[i]?.age || ""} 
                              onChange={e => handleGuestInputChange(i, "age", e.target.value)}
                              className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">Gender</label>
                            <div className="relative">
                               <select 
                                 value={guestDetails[i]?.gender || "Male"}
                                 onChange={e => handleGuestInputChange(i, "gender", e.target.value)}
                                 className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#003366] appearance-none cursor-pointer"
                               >
                                 <option>Male</option>
                                 <option>Female</option>
                                 <option>Other</option>
                               </select>
                               <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                            </div>
                          </div>
                       </div>
                    </div>
                  ))}
                  </div>
               </div>
             )}

             {/* STEP 4: REVIEW */}
             {bookingStep === 4 && (
               <div className="space-y-8 animate-fade-in">
                  <div className="text-center">
                     <h3 className="text-2xl font-bold text-gray-900 font-serif mb-2">Confirm Your Stay</h3>
                     <p className="text-gray-500">Please review the details before payment.</p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><FaCheck size={100} /></div>
                     <div className="grid grid-cols-2 gap-8 relative z-10">
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Check-in</p>
                            <p className="text-lg font-bold text-gray-800">{checkIn}</p>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Check-out</p>
                            <p className="text-lg font-bold text-gray-800">{checkOut}</p>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Guests</p>
                            <p className="text-lg font-bold text-gray-800">{numGuests} People</p>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Room Type</p>
                            <p className="text-lg font-bold text-gray-800">{selectedRoom?.title}</p>
                         </div>
                     </div>
                     <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-end">
                        <div>
                           <p className="text-sm text-gray-500 mb-1">Total Amount to Pay</p>
                           <p className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded inline-block">Taxes Included</p>
                        </div>
                        <div className="text-right">
                           <span className="text-4xl font-bold text-[#003366]">
                             ₹{selectedRoom?.price ? (selectedRoom.price * numGuests * ((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))).toLocaleString() : 0}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
             )}

          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 flex justify-between bg-white shrink-0">
             {bookingStep > 1 ? (
               <button onClick={() => setBookingStep(p => p - 1)} className="px-8 py-4 font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">Back</button>
             ) : (
               <div></div>
             )}
             
             {bookingStep < 4 ? (
               <button onClick={nextStep} className="bg-[#003366] text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2">Next Step <FaChevronRight /></button>
             ) : (
               <button onClick={confirmBooking} className="bg-black text-white px-12 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2">
                 {bookingStatus.loading ? (
                   <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                 ) : (
                   <>Confirm Reservation <FaCheck /></>
                 )}
               </button>
             )}
          </div>

       </div>
    </div>
  );
};

export default BookingModal;
