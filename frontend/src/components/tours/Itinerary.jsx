import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

const ItineraryItem = ({ item, isLast, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentItem = itemRef.current;
    if (currentItem) {
      observer.observe(currentItem);
    }

    return () => {
      if (currentItem) {
        observer.unobserve(currentItem);
      }
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative pl-8 md:pl-10 group transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Timeline Line with gradient */}
      {!isLast && (
        <div className="absolute left-[11px] md:left-[15px] top-8 bottom-[-32px] w-[2px] bg-gradient-to-b from-blue-300 via-blue-200 to-gray-200 transition-all duration-500" />
      )}

      {/* Enhanced Timeline Dot */}
      <div
        className={`absolute left-0 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-3 flex items-center justify-center bg-white z-10 transition-all duration-300 shadow-md ${
          isOpen
            ? "border-[#003366] text-[#003366] scale-110 shadow-lg ring-4 ring-blue-100"
            : "border-gray-300 text-gray-400 group-hover:border-blue-400 group-hover:scale-105"
        }`}
      >
        <span className="text-xs md:text-sm font-bold">{item.day}</span>
      </div>

      <div
        className={`bg-white rounded-2xl shadow-sm border transition-all duration-500 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 ${
          isOpen
            ? "ring-2 ring-[#003366] border-[#003366] shadow-lg"
            : "border-gray-100 hover:border-blue-200"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3
              className={`text-lg md:text-xl font-bold transition-colors ${
                isOpen ? "text-[#003366]" : "text-gray-800"
              }`}
            >
              {item.location}
            </h3>
            {item.day === 1 && (
              <span className="bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                Start
              </span>
            )}
          </div>

          <div
            className={`p-2 rounded-full transition-all duration-300 ${
              isOpen ? "bg-[#003366] rotate-180" : "bg-gray-100 group-hover:bg-blue-50"
            }`}
          >
            <FaChevronDown
              className={`transition-colors duration-300 ${
                isOpen ? "text-white" : "text-gray-500"
              }`}
              size={16}
            />
          </div>
        </div>

        {/* Smooth Collapsible Content */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 border-t border-gray-100 bg-gradient-to-br from-blue-50/30 to-transparent">
            <ul className="space-y-3 mt-4">
              {item.activities.map((activity, actIndex) => (
                <li
                  key={actIndex}
                  className="flex gap-3 text-sm md:text-base text-gray-700 group/item"
                  style={{
                    animation: isOpen ? `fadeInLeft 0.4s ease-out ${actIndex * 0.05}s both` : "none",
                  }}
                >
                  <span className="w-2 h-2 bg-gradient-to-br from-[#003366] to-blue-400 rounded-full mt-2 shrink-0 group-hover/item:scale-125 transition-transform" />
                  <span className="leading-relaxed group-hover/item:text-[#003366] transition-colors">
                    {activity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Itinerary = ({ itinerary }) => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentHeader = headerRef.current;
    if (currentHeader) {
      observer.observe(currentHeader);
    }

    return () => {
      if (currentHeader) {
        observer.unobserve(currentHeader);
      }
    };
  }, []);

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
      <div
        ref={headerRef}
        className={`transition-all duration-700 ${
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-8 pb-4 border-b-2 border-gradient-to-r from-[#003366] to-blue-300">
          Itinerary
        </h2>
      </div>
      <div className="space-y-6 md:space-y-8">
        {itinerary.map((item, index) => (
          <ItineraryItem
            key={index}
            item={item}
            isLast={index === itinerary.length - 1}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default Itinerary;
