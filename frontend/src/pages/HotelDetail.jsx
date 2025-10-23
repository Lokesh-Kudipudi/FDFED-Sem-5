import React, { useState } from "react";
import "./HotelDetails.css";

const HotelPage = ({ hotel }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleReserve = async (room) => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < today || checkOutDate < today) {
      alert("Check-in and check-out dates cannot be in the past.");
      return;
    }

    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const totalPrice = room.price * nights;

    const bookingDetails = {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      price: totalPrice,
      status: "pending",
    };

    try {
      const response = await fetch(`/hotels/booking/${hotel._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      });
      const data = await response.json();

      if (data.status === "success") {
        alert("Booking successful!");
        window.location.href = "/dashboard/myTrips";
      } else {
        alert("Booking failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="headerContainer" id="overview" style={{ width: "90%", margin: "0 auto" }}>
        {/* Replace this with your header component */}
        <h2>Chasing Horizons</h2>
      </header>

      {/* Image Grid */}
      <div className="image-grid">
        <div className="main-image">
          <img src={hotel.mainImage} alt="Main hotel view" />
        </div>
        {hotel.images.map((img, i) => (
          <div key={i} className="small-image">
            <img src={img} alt={`Hotel view ${i}`} />
          </div>
        ))}
      </div>

      {/* Section Navbar */}
      <div className="section-navbar">
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
            className={`section-navbar-link ${activeSection === section.id ? "active" : ""}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.name}
          </a>
        ))}
        <div className="underline"></div>
      </div>

      {/* Hotel Details */}
      <div className="container">
        <div className="hotel-details" id="hotel-details">
          <h1>{hotel.title}</h1>
          <div className="rating">{"⭐".repeat(hotel.rating)}</div>
          <p className="reserve-now">✔️ <span>Reserve now, pay later</span></p>

          <h2>About this property</h2>
          <p><strong>DESCRIPTION:</strong> {hotel.description}</p>
          <p><strong>ADDRESS:</strong> {hotel.address}</p>

          <h2>Amenities</h2>
          <div className="amenities">
            {hotel.amenities.map((a, i) => (
              <div key={i} className="amenity">{a}</div>
            ))}
          </div>
        </div>

        <hr className="section-divider" />

        {/* Choose Room */}
        <header>
          <h1>Choose your room</h1>
          <div className="filters" id="filters">
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
        </header>

        <div className="room-container">
          {hotel.roomType.map((room, i) => (
            <div className="room-card" key={i}>
              <img src={room.image} alt={room.title} />
              <h2>{room.title}</h2>
              <p className="rating">{"⭐".repeat(room.rating)}</p>
              <ul>
                {room.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <div className="price"><p>{room.price} INR</p></div>
              <button className="reserve-btn" onClick={() => handleReserve(room)}>Reserve</button>
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        {/* Accessibility */}
        <div className="accessibility-section" id="accessibility-section">
          <h2>Accessibility</h2>
          <p>
            If you have specific accessibility needs, please contact the property using your booking confirmation.
          </p>
          <div className="accessibility-columns">
            {Object.entries(hotel.features).map(([section, items]) => (
              <div className="accessibility-category" key={section}>
                <h3>{section}</h3>
                <ul>
                  {items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <hr className="section-divider" />

        {/* Policies */}
        <div className="fees-policies-section" id="fees-policies-section">
          <h2>Fees & Policies</h2>
          <div className="policy-category">
            <h3>Policies</h3>
            {hotel.policies.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <hr className="section-divider" />

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {hotel.faq.map((item, i) => (
            <div className={`faq-item ${activeFaq === i ? "active" : ""}`} key={i}>
              <button className="faq-question" onClick={() => toggleFaq(i)}>
                {item.question}
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-about">
            <h3>Chasing Horizons</h3>
            <p>Explore the beauty of India with us. Your journey starts here!</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/tours">Tours</a></li>
              <li><a href="/hotels">Hotels</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-youtube" style={{ fontSize: 40 }}></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-square-instagram" style={{ fontSize: 40 }}></i>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-square-x-twitter" style={{ fontSize: 40 }}></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Chasing Horizons. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HotelDetails;

