import { useState, useEffect, useRef } from "react";

const PlacesToVisit = ({ destinations }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = document.querySelectorAll("[data-index]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [destinations]);

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
        <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-6 pb-4 border-b-2 border-blue-100">
          Places to Visit
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations?.map((destination, index) => (
          <div
            key={index}
            data-index={index}
            className={`group cursor-pointer transition-all duration-700 ${
              visibleItems.includes(index)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <img
                src={destination.image || "https://via.placeholder.com/400x300"}
                alt={destination.name}
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-xl font-bold mb-2 drop-shadow-lg">{destination.name}</h3>
                {destination.description && (
                  <p className="text-sm text-white/90 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {destination.description}
                  </p>
                )}
              </div>

              {/* Corner Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <span className="text-[#003366] font-semibold text-sm">Day {index + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlacesToVisit;
