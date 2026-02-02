import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";
import { useBooking } from "../../hooks/useBooking";
import { 
  FaStar, FaMapMarkerAlt, FaCheck, FaWifi, FaSwimmingPool, 
  FaUtensils, FaSpa, FaDumbbell, FaConciergeBell, FaTimes, 
  FaUser, FaCalendarAlt, FaChevronRight, FaChevronLeft, FaInfoCircle
} from "react-icons/fa";

const HotelDetails = () => {  
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [hotel, setHotel] = useState({});
  const { id } = useParams();
  
  // Booking State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [numGuests, setNumGuests] = useState(1);
  const [guestDetails, setGuestDetails] = useState([{ name: "", age: "", gender: "Male" }]);
  const [bookingStep, setBookingStep] = useState(1); // 1: Dates, 2: Guests, 3: Details, 4: Review

  const { bookHotel, bookingStatus } = useBooking();

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5500/hotels/hotel/${id}`);
        const data = await response.json();
        setHotel(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHotelDetails();
  }, [id]);

  useEffect(() => {
    if (bookingStatus.success) {
      toast.success("Booking successful!");
      setShowBookingModal(false);
    }
    if (bookingStatus.error) {
      toast.error("Booking failed: " + bookingStatus.error);
    }
  }, [bookingStatus]);

  // Handle Guest Count Change
  const handleGuestCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumGuests(count);
    const newGuestDetails = Array(count).fill(null).map((_, i) => guestDetails[i] || { name: "", age: "", gender: "Male" });
    setGuestDetails(newGuestDetails);
  };

  // Handle Guest Details Input
  const handleGuestInputChange = (index, field, value) => {
    const newDetails = [...guestDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setGuestDetails(newDetails);
  };

  // Open Booking Modal for a specific room
  const initiateBooking = (room) => {
    setSelectedRoom(room);
    setBookingStep(1);
    setShowBookingModal(true);
  };

  // Proceed to next step
  const nextStep = () => {
    if (bookingStep === 1) {
      if (!checkIn || !checkOut) {
        toast.error("Please select both check-in and check-out dates.");
        return;
      }
      const today = new Date();
      today.setHours(0,0,0,0);
      if (new Date(checkIn) < today) {
        toast.error("Check-in date cannot be in the past.");
        return;
      }
      if (new Date(checkOut) <= new Date(checkIn)) {
        toast.error("Check-out date must be after check-in date.");
        return;
      }
    }
    if (bookingStep === 3) {
      // Validate guest details
      for (const guest of guestDetails) {
        if (!guest.name || !guest.age) {
          toast.error("Please fill in all guest details.");
          return;
        }
      }
    }
    setBookingStep((prev) => prev + 1);
  };

  // Submit Booking
  const confirmBooking = async () => {
    if (!selectedRoom) return;
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    const totalPrice = selectedRoom.price * nights * numGuests;

    const bookingDetails = {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      price: totalPrice,
      status: "pending",
      numGuests,
      guests: guestDetails,
      roomType: selectedRoom.title
    };

    await bookHotel(hotel._id, bookingDetails);
  };

  // Helper icons map
  const getAmenityIcon = (name) => {
    const lower = name?.toLowerCase() || "";
    if (lower.includes("wifi")) return <FaWifi />;
    if (lower.includes("pool")) return <FaSwimmingPool />;
    if (lower.includes("dining") || lower.includes("breakfast")) return <FaUtensils />;
    if (lower.includes("spa")) return <FaSpa />;
    if (lower.includes("gym") || lower.includes("fitness")) return <FaDumbbell />;
    return <FaConciergeBell />;
  };

  if (!hotel.title) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366]"></div></div>;

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#003366] selection:text-white">
      <Header />

      {/* Parallax Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden mt-16 group">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src={hotel.mainImage} 
            alt="Hero" 
            className="w-full h-full object-cover transform transition-transform duration-[10s] ease-out scale-100 group-hover:scale-110" // Slow zoom effect
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end pb-20 px-8 max-w-7xl mx-auto">
             <div className="animate-slide-up bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-3xl">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                   {"⭐".repeat(Math.round(hotel.rating))}
                   <span className="text-white text-sm font-medium tracking-wide ml-2 bg-white/20 px-2 py-0.5 rounded-full">{hotel.rating} Excellent</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-lg">{hotel.title}</h1>
                <p className="flex items-center gap-2 text-xl text-white/90 font-light"><FaMapMarkerAlt /> {hotel.location}</p>
             </div>
          </div>
      </div>

      {/* Gallery Strip - Floating */}
      <div className="-mt-16 relative z-30 max-w-7xl mx-auto px-4 md:px-8 mb-20 pointer-events-none">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pointer-events-auto">
            {hotel?.images?.slice(0, 4).map((img, i) => (
               <div key={i} className="h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform transition-all hover:-translate-y-2 hover:shadow-orange-500/20 cursor-pointer">
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
               </div>
            ))}
          </div>
      </div>

      {/* Sticky Premium Nav */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100 mb-12">
         <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between py-4">
             <div className="flex gap-8 overflow-x-auto no-scrollbar">
                {["Overview", "Amenities", "Rooms", "Policies", "FAQ"].map((section) => (
                  <a 
                    key={section} 
                    href={`#${section.toLowerCase()}`}
                    onClick={(e) => { e.preventDefault(); setActiveSection(section.toLowerCase()); document.getElementById(section.toLowerCase())?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    className={`text-sm font-bold uppercase tracking-widest transition-all ${activeSection === section.toLowerCase() ? "text-[#003366] border-b-2 border-[#003366]" : "text-gray-400 hover:text-gray-900"}`}
                  >
                    {section}
                  </a>
                ))}
            </div>
            <div className="hidden md:block">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Luxury Stay</span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-32">
         
         {/* Main Content */}
         <div className="lg:col-span-8 space-y-20">
            
            {/* Overview */}
            <section id="overview" className="scroll-mt-40">
               <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">The Experience</h2>
               <p className="text-gray-600 leading-8 text-lg font-light tracking-wide first-letter:text-5xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-[#003366]">
                 {hotel.description}
               </p>
               <div className="mt-8 flex gap-6">
                  <div className="flex items-center gap-3 text-sm font-bold text-[#003366] bg-blue-50 px-5 py-3 rounded-full border border-blue-100">
                     <FaCheck className="text-lg" /> Free Cancellation
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[#003366] bg-blue-50 px-5 py-3 rounded-full border border-blue-100">
                     <FaCheck className="text-lg" /> Pay at Hotel
                  </div>
               </div>
            </section>

            {/* Amenities */}
            <section id="amenities" className="scroll-mt-40">
               <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Curated Amenities</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {hotel.amenities?.map((am, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300 group">
                       <span className="text-[#003366] text-3xl mb-3 group-hover:scale-110 transition-transform">{getAmenityIcon(am)}</span>
                       <span className="text-gray-600 font-medium text-center text-sm">{am}</span>
                    </div>
                  ))}
               </div>
            </section>

            {/* Rooms - Horizontal Cards */}
            <section id="rooms" className="scroll-mt-40">
               <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Select Your Sanctuary</h2>
               <div className="space-y-8">
                  {hotel.roomType?.map((room, i) => (
                    <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col md:flex-row h-auto md:h-80">
                       <div className="md:w-5/12 overflow-hidden relative">
                          <img src={room.image} alt={room.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                       </div>
                       <div className="p-8 md:w-7/12 flex flex-col justify-between">
                          <div>
                             <div className="flex justify-between items-start mb-3">
                                <h3 className="text-2xl font-bold text-gray-900 font-serif">{room.title}</h3>
                                <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                   4.9 <FaStar size={10} />
                                </div>
                             </div>
                             <p className="text-gray-500 text-sm mb-6 line-clamp-2">Experience luxury with city views, premium bedding, and soundproof interiors designed for ultimate relaxation.</p>
                             <div className="flex flex-wrap gap-2">
                                {room.features.slice(0, 3).map((f, j) => (
                                  <span key={j} className="text-xs border border-gray-200 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">{f}</span>
                                ))}
                             </div>
                          </div>
                          <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-100">
                             <div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Avg. Nightly Rate</p>
                                <span className="text-3xl font-bold text-[#003366]">₹{room.price}</span>
                             </div>
                             <button 
                               onClick={() => initiateBooking(room)}
                               className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-[#003366] transition-colors shadow-lg flex items-center gap-2 group-hover:gap-3"
                             >
                               Reserve <FaChevronRight size={12} />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

             {/* Policies */}
             <section id="policies" className="scroll-mt-40 bg-stone-50 p-10 rounded-3xl border border-stone-100">
               <h2 className="text-2xl font-bold text-stone-800 mb-6 font-serif">Property Policies</h2>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.policies?.map((p, i) => (
                    <li key={i} className="flex gap-4 text-stone-600 items-start">
                      <FaInfoCircle className="mt-1 flex-shrink-0 text-stone-400" />
                      <span className="text-sm leading-relaxed">{p}</span>
                    </li>
                  ))}
               </ul>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-40">
               <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Common Questions</h2>
               <div className="space-y-4">
                  {hotel.faq?.map((item, i) => (
                    <div key={i} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${activeFaq === i ? "bg-white shadow-lg border-gray-100" : "bg-transparent border-gray-200"}`}>
                       <button onClick={() => toggleFaq(i)} className="w-full flex justify-between items-center p-6 text-left font-bold text-gray-800 hover:text-[#003366]">
                          {item.question}
                          <span className={`transition-transform duration-300 ${activeFaq === i ? "rotate-180" : ""}`}>▼</span>
                       </button>
                       <div className={`px-6 text-gray-600 overflow-hidden transition-all duration-300 ${activeFaq === i ? "max-h-40 pb-6" : "max-h-0"}`}>
                          {item.answer}
                       </div>
                    </div>
                  ))}
               </div>
            </section>

         </div>

         {/* Sidebar */}
         <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-40 space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                   <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif border-b border-gray-100 pb-4">Highlights</h3>
                   <div className="space-y-6">
                      {hotel?.features && Object.entries(hotel.features).slice(0, 3).map(([key, items]) => (
                        <div key={key}>
                           <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">{key}</h4>
                           <ul className="space-y-2">
                             {items.slice(0, 2).map((it, idx) => (
                               <li key={idx} className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                                 <div className="w-1.5 h-1.5 bg-[#003366] rounded-full"></div> {it}
                               </li>
                             ))}
                           </ul>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                   <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2698&auto=format&fit=crop" alt="Adv" className="w-full h-80 object-cover" />
                   <div className="absolute inset-0 bg-[#003366]/80 flex flex-col justify-center items-center text-center p-8 text-white">
                      <h3 className="font-serif text-2xl font-bold mb-2">Private Concierge</h3>
                      <p className="text-sm text-white/70 mb-6">Need special arrangements? We are here to help.</p>
                      <button className="bg-white text-[#003366] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors w-full">Chat Now</button>
                   </div>
                </div>
            </div>
         </div>
      </div>

      <Footer />

      {/* GLASSMORPHIC BOOKING MODAL 2.0 */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#003366]/30 backdrop-blur-md p-4 animate-fade-in">
           <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#003366] to-[#001a33] p-8 text-white flex justify-between items-start shrink-0">
                 <div>
                   <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Booking Request</p>
                   <h2 className="text-2xl font-serif font-bold">{selectedRoom?.title}</h2>
                   <p className="text-white/80 text-sm mt-1 flex items-center gap-2"><FaMapMarkerAlt /> {hotel?.location}</p>
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
                            <p className="text-gray-500 text-sm">Select your check-in and check-out dates.</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Check-in</label>
                            <input 
                              type="date" 
                              value={checkIn} 
                              onChange={e => setCheckIn(e.target.value)} 
                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] outline-none transition-all font-medium text-gray-700" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Check-out</label>
                            <input 
                              type="date" 
                              value={checkOut} 
                              onChange={e => setCheckOut(e.target.value)} 
                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] outline-none transition-all font-medium text-gray-700" 
                            />
                         </div>
                      </div>
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
      )}
    </div>
  );
};

export default HotelDetails;
