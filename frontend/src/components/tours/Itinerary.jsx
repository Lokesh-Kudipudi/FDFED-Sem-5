import { useState } from "react";
import { FaChevronDown, FaMapMarkerAlt } from "react-icons/fa";

const ItineraryItem = ({ item, isLast }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative pl-8 md:pl-10 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[11px] md:left-[15px] top-8 bottom-[-32px] w-[2px] bg-gray-200 group-hover:bg-blue-200 transition-colors" />
      )}
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors ${
        isOpen ? "border-[#003366] text-[#003366]" : "border-gray-300 text-gray-400 group-hover:border-blue-400"
      }`}>
        <span className="text-xs md:text-sm font-bold">{item.day}</span>
      </div>

      <div 
        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer ${isOpen ? 'ring-1 ring-blue-100' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-4 md:p-5 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-[#003366]' : 'text-gray-800'}`}>
                {item.location}
              </h3>
              {item.day === 1 && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Start</span>
              )}
           </div>
           
           <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#003366]' : ''}`} />
        </div>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
           <div className="px-5 pb-5 pt-0 border-t border-gray-50 bg-gray-50/50">
              <ul className="space-y-3 mt-4">
                {item.activities.map((activity, index) => (
                  <li key={index} className="flex gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                    <span className="leading-relaxed">{activity}</span>
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
  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-[#003366] mb-8 border-b border-gray-100 pb-2">
         Itinerary
      </h2>
      <div className="space-y-8">
        {itinerary.map((item, index) => (
          <ItineraryItem 
            key={index} 
            item={item} 
            isLast={index === itinerary.length - 1} 
          />
        ))}
      </div>
    </section>
  );
};

export default Itinerary;
