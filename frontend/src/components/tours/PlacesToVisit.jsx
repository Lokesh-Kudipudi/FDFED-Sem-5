// components/PlacesToVisit.jsx
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PlacesToVisit = ({ destinations }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative group/section">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
         <h2 className="text-2xl font-bold text-[#003366]">Places to Visit</h2>
         <div className="flex gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity">
            <button onClick={() => scroll('left')} className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full text-blue-600 transition-colors">
               <FaChevronLeft size={14} />
            </button>
            <button onClick={() => scroll('right')} className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full text-blue-600 transition-colors">
               <FaChevronRight size={14} />
            </button>
         </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-2 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {destinations.map((destination, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[240px] h-[320px] relative rounded-2xl overflow-hidden shadow-md group cursor-pointer snap-center"
          >
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

            {/* Glass Title */}
            <div className="absolute bottom-4 left-4 right-4">
               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl">
                  <h3 className="text-white font-bold text-lg text-center drop-shadow-md">
                    {destination.name}
                  </h3>
               </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlacesToVisit;
