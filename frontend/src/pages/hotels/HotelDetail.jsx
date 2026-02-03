import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";
import { useBooking } from "../../hooks/useBooking";
import HotelHero from "../../components/hotels/HotelHero";
import HotelGallery from "../../components/hotels/HotelGallery";
import HotelStickyNav from "../../components/hotels/HotelStickyNav";
import HotelOverview from "../../components/hotels/HotelOverview";
import HotelAmenities from "../../components/hotels/HotelAmenities";
import HotelRooms from "../../components/hotels/HotelRooms";
import HotelPolicies from "../../components/hotels/HotelPolicies";
import HotelFAQ from "../../components/hotels/HotelFAQ";
import HotelSidebar from "../../components/hotels/HotelSidebar";
import BookingModal from "../../components/hotels/BookingModal";

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
  
  const [bookedDates, setBookedDates] = useState([]);
  const [loadingBookedDates, setLoadingBookedDates] = useState(false);

  const { bookHotel, bookingStatus } = useBooking();

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Fetch booked dates when a room is selected
  useEffect(() => {
    if (selectedRoom && selectedRoom._id && showBookingModal) {
        const fetchBookedDates = async () => {
             setLoadingBookedDates(true);
             try {
                 const response = await fetch(`http://localhost:5500/hotels/booking/availability/${hotel._id}?roomTypeId=${selectedRoom._id}`);
                 const data = await response.json();
                 if (data.status === "success") {
                     setBookedDates(data.data);
                     console.log(data.data);
                     
                 }
             } catch (err) {
                 console.error("Failed to fetch booked dates", err);
                 // Toast maybe?
             } finally {
                 setLoadingBookedDates(false);
             }
        };
        fetchBookedDates();
    }
  }, [selectedRoom, showBookingModal, hotel._id]);

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


  // Handle Guest Details Input
  const handleGuestInputChange = (index, field, value) => {
    const newDetails = [...guestDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setGuestDetails(newDetails);
  };

  // Open Booking Modal for a specific room
  const initiateBooking = (room) => {
    setSelectedRoom(room);
    setCheckIn(""); // Reset dates
    setCheckOut("");
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
      startDate: new Date(checkIn),
      endDate: new Date(checkOut),
      numGuests,
      guests: guestDetails,
      roomType: selectedRoom.title,
      roomTypeId: selectedRoom._id
    };

    await bookHotel(hotel._id, bookingDetails);
  };

  if (!hotel.title) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366]"></div></div>;

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#003366] selection:text-white">
      <Header />

      <HotelHero hotel={hotel} />

      <HotelGallery images={hotel?.images} />

      <HotelStickyNav activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-32">
         
         {/* Main Content */}
         <div className="lg:col-span-8 space-y-20">
            
            <HotelOverview description={hotel.description} />

            <HotelAmenities amenities={hotel.amenities} />

            <HotelRooms rooms={hotel.roomType} initiateBooking={initiateBooking} />

            <HotelPolicies policies={hotel.policies} />

            <HotelFAQ faq={hotel.faq} activeFaq={activeFaq} toggleFaq={toggleFaq} />

         </div>

         <HotelSidebar features={hotel.features} />
      </div>

      <Footer />

      <BookingModal 
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        item={hotel}
        selectedRoom={selectedRoom}
        bookedDates={bookedDates}
        loadingBookedDates={loadingBookedDates}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        numGuests={numGuests}
        setNumGuests={setNumGuests}
        guestDetails={guestDetails}
        handleGuestInputChange={handleGuestInputChange}
        bookingStep={bookingStep}
        setBookingStep={setBookingStep}
        nextStep={nextStep}
        confirmBooking={confirmBooking}
        bookingStatus={bookingStatus}
      />
    </div>
  );
};

export default HotelDetails;

