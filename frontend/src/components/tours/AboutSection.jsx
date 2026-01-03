import { Link } from "react-router-dom";
import AnimatedSection from "../AnimatedSection";

const AboutSection = () => {
  return (
    <AnimatedSection className="mx-auto my-20 max-w-[85vw] bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row transform transition-all duration-300 hover:shadow-2xl">
      <div className="relative w-full md:w-2/5 h-64 md:h-auto">
        <img
          src="https://images.pexels.com/photos/22614625/pexels-photo-22614625/free-photo-of-idyllic-beach-on-bangaram-island-in-india.jpeg"
          alt="Beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 bg-[#003366] text-white p-5 rounded-xl text-center shadow-lg animate-fade-in">
          <span className="text-4xl font-bold block mb-1">5+</span>
          <span className="text-sm font-medium opacity-90">years of excellence</span>
        </div>
      </div>
      <div className="w-full md:w-3/5 p-10 md:p-12 flex flex-col justify-center">
        <h3 className="text-blue-600 text-sm font-bold tracking-wider mb-2">
          ABOUT US
        </h3>
        <h1 className="text-4xl text-[#003366] font-bold mb-6">
          Chasing Horizons
        </h1>
        <p className="text-gray-600 leading-relaxed mb-6 text-lg">
          Chasing Horizons is a premier tourism and hotel booking
          site, dedicated to providing unforgettable travel
          experiences. We have been trusted by countless travelers to plan and book their perfect getaways.
        </p>
        <ul className="mb-8 space-y-3">
          <li className="text-gray-700 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
             Custom Travel Packages
          </li>
          <li className="text-gray-700 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
             Luxury Hotel Accommodations
          </li>
          <li className="text-gray-700 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
             24/7 Expert Support
          </li>
        </ul>
        <Link
          to="/tours/search"
          className="inline-block self-start px-8 py-3 bg-[#003366] text-white rounded-full hover:bg-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
        >
          Discover More →
        </Link>
      </div>
    </AnimatedSection>
  );
};

export default AboutSection;
