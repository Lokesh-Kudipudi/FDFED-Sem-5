import { FaPlaneDeparture, FaHotel, FaWallet } from "react-icons/fa";
import AnimatedSection from "../AnimatedSection";

export default function ServicesSection() {
  return (
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
  );
}
