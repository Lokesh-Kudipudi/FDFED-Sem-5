import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"
import { useBooking } from "../hooks/useBooking";

const HotelDetails = () => {  
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [hotel, setHotel] = useState({});
  const { id } = useParams();
  const navigate = useNavigate()

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5500/hotels/hotel/${id}`
        );
        const data = await response.json();
        setHotel(data.data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHotelDetails();
  }, []);

  const { bookHotel, bookingStatus } = useBooking();

  const handleReserve = async (room) => {
    if (!checkIn || !checkOut) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }

    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < today || checkOutDate < today) {
      toast.error(
        "Check-in and check-out dates cannot be in the past."
      );
      return;
    }

    const nights =
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const totalPrice = room.price * nights;

    const bookingDetails = {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      price: totalPrice,
      status: "pending",
    };

    await bookHotel(hotel._id, bookingDetails);
  };

  useEffect(() => {
    if (bookingStatus.success) {
      toast.success("Booking successful!");
    }
    if (bookingStatus.error) {
      toast.error("Booking failed: " + bookingStatus.error);
    }
  }, [bookingStatus]);

  return (
    <div className="scroll-smooth">
      {/* Header */}
      <Header />

      {/* Image Grid */}
      <div className="grid grid-cols-[2fr_1fr_1fr] grid-rows-[250px_250px] gap-2.5 w-[95%] mx-auto my-8 pt-20">
        <div className="row-span-2 h-full">
          <img
            src={hotel.mainImage}
            alt="Main hotel view"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {hotel?.images?.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img}
              alt={`Hotel view ${i}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Section Navbar */}
      <div className="flex justify-start items-center gap-8 py-9 px-10 bg-white border-b-2 border-gray-200 sticky top-0 z-50">
        {[
          { id: "overview", name: "Overview" },
          { id: "hotel-details", name: "About" },
          { id: "filters", name: "Rooms" },
          { id: "accessibility-section", name: "Accessibility" },
          { id: "fees-policies-section", name: "Policies" },
        ].map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`text-base font-bold pb-2 relative no-underline ${
              activeSection === section.id
                ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[3px] after:bg-blue-600"
                : "text-gray-800"
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.name}
          </a>
        ))}
      </div>

      {/* Hotel Details */}
      <div className="max-w-7xl mx-auto">
        <div
          className="w-[95%] mx-auto my-8 bg-white p-8 rounded-lg"
          id="hotel-details"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {hotel?.title}
          </h1>
          <div className="text-lg text-yellow-500 mb-2.5">
            {"⭐".repeat(hotel?.rating)}
          </div>
          <p className="text-green-600 font-bold text-base mb-5">
            ✔️ <span>Reserve now, pay later</span>
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            About this property
          </h2>
          <p className="mb-4">
            <strong>DESCRIPTION:</strong> {hotel?.description}
          </p>
          <p className="mb-4">
            <strong>ADDRESS:</strong> {hotel.address}
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Amenities
          </h2>
          <div className="grid grid-cols-3 gap-4 mt-5">
            {hotel?.amenities?.map((a, i) => (
              <div
                key={i}
                className="flex items-center text-gray-600"
              >
                {a}
              </div>
            ))}
          </div>
        </div>

        <hr className="border-t border-gray-200 my-5 w-full" />

        {/* Choose Room */}
        <header>
          <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Choose your room
          </h1>
          <div
            className="flex justify-center gap-2.5 mb-5"
            id="filters"
          >
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="p-2.5 text-base rounded-md border border-gray-300"
            />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="p-2.5 text-base rounded-md border border-gray-300"
            />
          </div>
        </header>

        <div className="flex gap-5 justify-center flex-wrap">
          {hotel?.roomType?.map((room, i) => (
            <div
              className="bg-white p-4 rounded-lg shadow-md w-[300px] overflow-hidden relative"
              key={i}
            >
              <img
                src={room.image}
                alt={room.title}
                className="w-full rounded-xl"
              />
              <h2 className="text-lg font-semibold my-2.5">
                {room.title}
              </h2>
              <p className="text-green-600 font-bold mb-2.5">
                {"⭐".repeat(room.rating)}
              </p>
              <ul className="list-none p-0">
                {room.features.map((f, j) => (
                  <li key={j} className="mb-1.5 text-sm">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <p className="text-xl font-bold text-gray-800">
                  {room.price} INR
                </p>
              </div>
              <button
                className="w-full bg-[#0071c2] text-white py-2.5 px-2.5 rounded mt-4 text-base cursor-pointer hover:bg-[#005fa3] transition-colors"
                onClick={() => handleReserve(room)}
              >
                Reserve
              </button>
            </div>
          ))}
        </div>

        <hr className="border-t border-gray-200 my-5 w-full" />

        {/* Accessibility */}
        <div
          className="bg-gray-50 p-8 my-8 rounded-lg w-[95%] mx-auto"
          id="accessibility-section"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Accessibility
          </h2>
          <p className="text-base text-gray-600 mb-5">
            If you have specific accessibility needs, please
            contact the property using your booking confirmation.
          </p>
          <div className="flex flex-col gap-2.5">
            {Object.entries(hotel.features || {})?.map(
              ([section, items]) => (
                <div className="flex-1" key={section}>
                  <h3 className="text-xl text-[#1a1f71] mb-3 flex items-center">
                    {section}
                  </h3>
                  <ul className="list-none p-0 m-0">
                    {items.map((item, i) => (
                      <li
                        key={i}
                        className="text-base text-gray-600 pl-5 relative mb-2 before:content-['•'] before:absolute before:left-0 before:text-[#1a1f71] before:text-lg"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>

        <hr className="border-t border-gray-200 my-5 w-full" />

        {/* Policies */}
        <div
          className="bg-white p-8 my-8 rounded-lg w-[95%] mx-auto flex flex-col"
          id="fees-policies-section"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-0">
            Fees & Policies
          </h2>
          <div className="pl-8 mt-2.5 mb-5">
            <h3 className="text-xl text-[#1a1f71] mb-3 font-bold">
              Policies
            </h3>
            {hotel?.policies?.map((p, i) => (
              <p
                key={i}
                className="text-base text-gray-600 mb-2.5"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <hr className="border-t border-gray-200 my-5 w-full" />

        {/* FAQ Section */}
        <div className="max-w-[900px] mx-auto my-8">
          <h2 className="text-2xl font-bold mb-5 text-[#1a1a1a]">
            Frequently Asked Questions
          </h2>
          {hotel?.faq?.map((item, i) => (
            <div
              className="border-b border-gray-200 py-2.5 overflow-hidden"
              key={i}
            >
              <button
                className={`w-full text-left bg-transparent border-0 p-4 text-lg font-semibold text-[#1a1a1a] cursor-pointer focus:outline-none flex justify-between items-center transition-colors`}
                onClick={() => toggleFaq(i)}
              >
                {item.question}
                <span
                  className={`transform transition-transform ${
                    activeFaq === i ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`px-4 text-gray-600 text-base overflow-hidden transition-all duration-300 ${
                  activeFaq === i
                    ? "max-h-[200px] py-2.5"
                    : "max-h-0"
                }`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HotelDetails;
