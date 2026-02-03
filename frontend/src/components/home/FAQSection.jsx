import { useState } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import AnimatedSection from "../AnimatedSection";

export default function FAQSection() {
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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

  return (
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
          {displayFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className={`border border-gray-200 rounded-xl hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden ${
                  isOpen ? 'bg-blue-50/30 shadow-lg' : 'bg-white'
                }`}
                style={{
                  animation: showAllFaqs && idx >= 3 ? `slideIn 0.3s ease-out ${(idx - 3) * 0.1}s both` : 'none'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex justify-between items-center text-left outline-none"
                >
                  <span className="font-semibold text-gray-800">{faq.q}</span>
                  <span className={`text-[#003366] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <FaChevronDown />
                  </span>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  style={{
                    overflow: 'hidden'
                  }}
                >
                  <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-10">
          <button 
            onClick={() => {
              setShowAllFaqs(!showAllFaqs);
              if(showAllFaqs) {
                setFaqSearch("");
                setOpenFaqIndex(null);
              }
            }}
            className="bg-[#003366] text-white px-8 py-3 rounded-full font-medium hover:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform flex items-center gap-2 mx-auto group"
          >
            <span className="transition-all duration-300">
              {showAllFaqs ? 'Show Less' : 'View More FAQs'}
            </span>
            <span className={`transition-transform duration-300 ${showAllFaqs ? 'rotate-180' : ''}`}>
              <FaChevronDown />
            </span>
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
}
