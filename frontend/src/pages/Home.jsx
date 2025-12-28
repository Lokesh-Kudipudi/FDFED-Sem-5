import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import ItineraryCard from "../components/ItineraryCard";
import AnimatedSection from "../components/AnimatedSection";
import { FaPlaneDeparture, FaHotel, FaWallet, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Home() {
  const [randomHotels, setRandomHotels] = useState([]);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");

  const faqs = [
    { q: "How do I find travel deals?", a: "Subscribe to our newsletter and follow seasonal promotions on the deals page." },
    { q: "What payment methods are accepted?", a: "We accept major credit cards (Visa, MasterCard), debit cards, and selected digital wallets like PayPal and GPay." },
    { q: "How can I manage my bookings?", a: "Log in to your account and go to Dashboard > Bookings to view and modify reservations." },
    { q: "Do you offer travel insurance?", a: "Yes, we offer comprehensive travel insurance packages that can be added during the booking process." },
    { q: "What is your cancellation policy?", a: "Cancellations made 48 hours prior to the trip are fully refundable. Please check specific tour details for variations." },
    { q: "Can I customize my tour package?", a: "Absolutely! Use our 'Personalized Travel Packages' service to request a custom itinerary tailored to your needs." },
    { q: "Are visa services included?", a: "We provide visa assistance and guidance, but we do not process visa applications directly unless specified in the package." },
    { q: "How do I contact customer support?", a: "You can reach our 24/7 support team via the 'Contact Us' page or the live chatbot at the bottom right." }
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(faqSearch.toLowerCase()));
  const displayFaqs = showAllFaqs ? filteredFaqs : faqs.slice(0, 3);

  useEffect(() => {
    fetch("http://localhost:5500/hotels/search")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const shuffled = data.data.sort(() => 0.5 - Math.random());
          setRandomHotels(shuffled.slice(0, 3));
        }
      })
      .catch((err) => console.error("Failed to fetch hotels", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src="https://static3.businessinsider.com/image/54cfea306bb3f7d1181b774b/10-travel-destinations-that-are-trending-right-now.jpg"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover brightness-50 animate-slow-zoom"
        />
        <div className="relative z-10 text-white px-4 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Chasing Horizons
          </h1>
          <p className="text-lg opacity-90 drop-shadow-md">
            Explore, Dream, Achieve.
          </p>
        </div>
      </section>

      {/* Services */}
      <AnimatedSection className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#003366] mb-4">
            Our Premium Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience world-class travel planning with our dedicated services designed to make your journey seamless.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaPlaneDeparture />,
              title: "Personalized Travel Packages",
              desc: "Tailored itineraries crafted specifically for your unique preferences and travel style."
            },
            {
              icon: <FaHotel />,
              title: "Luxury Hotel Booking",
              desc: "Access to exclusive rates at the world's finest hotels and resorts for a comfortable stay."
            },
            {
              icon: <FaWallet />,
              title: "Best Value Guaranteed",
              desc: "Competitive pricing without compromising on quality. Get the most out of your budget."
            }
          ].map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#003366] transition-colors duration-300">
                <span className="text-4xl text-[#003366] group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center group-hover:text-[#003366] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Itineraries */}
      <AnimatedSection className="py-20 px-6 bg-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#003366]">
              Find your next adventure
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
              Browse through itineraries and guides crafted by
              fellow travelers. Get inspired by real experiences
              and detailed plans for your next adventure.
            </p>
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {randomHotels.length > 0 ? (
            randomHotels.map((hotel, index) => (
              <div 
                key={hotel._id} 
              >
                <ItineraryCard
                  title={hotel.title}
                  description={hotel.description ? hotel.description.substring(0, 100) + "..." : "Experience luxury and comfort."}
                  image={hotel.mainImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                  href={`/hotels/hotel/${hotel._id}`}
                />
              </div>
            ))
          ) : (
             <div className="col-span-3 text-center text-gray-500">Loading adventures...</div>
          )}
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003366] text-center mb-10">
            Frequently Asked Questions
          </h2>

          {showAllFaqs && (
            <div className="mb-8 relative animate-fade-in">
              <input 
                type="text" 
                placeholder="Search FAQs..." 
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#003366] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          )}

          <div className="space-y-4">
            {displayFaqs.map((faq, idx) => (
              <details key={idx} className="group p-5 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors cursor-pointer open:bg-blue-50/30">
                <summary className="cursor-pointer font-semibold text-gray-800 list-none flex justify-between items-center outline-none">
                  {faq.q}
                  <span className="text-[#003366] transition-transform duration-300 group-open:rotate-180">
                    <FaChevronDown />
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed pl-1">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button 
              onClick={() => {
                setShowAllFaqs(!showAllFaqs);
                if(showAllFaqs) setFaqSearch(""); // Clear search on collapse
              }}
              className="bg-[#003366] text-white px-8 py-3 rounded-full font-medium hover:bg-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
            >
              {showAllFaqs ? (
                <>Show Less <FaChevronUp /></>
              ) : (
                <>View More FAQs <FaChevronDown /></>
              )}
            </button>
          </div>
        </div>
      </AnimatedSection>

      <Footer />

      <Chatbot />
    </div>
  );
}
