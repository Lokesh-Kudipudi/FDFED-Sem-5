import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AnimatedSection from "../AnimatedSection";

const Destinations = () => {
  const navigate = useNavigate();
  const [topDestinations, setTopDestinations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5500/tours/api/top-destinations")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTopDestinations(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch top destinations", err));
  }, []);

  return (
    <AnimatedSection className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-blue-600 font-bold text-sm tracking-wider uppercase mb-2">
          Find Your Passion
        </h3>
        <h1 className="text-4xl text-[#003366] font-bold mb-4">
          Top Destinations
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Discover India's most enchanting locations, from tranquil beaches to majestic mountains. 
          Curated by Chasing Horizons for your next adventure.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topDestinations.length > 0 ? (
          topDestinations.map((dest, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden h-64 group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${
                 // Span logic: make the first and sixth item span 2 cols for visual variety if desired, 
                 // or just keep uniform. Let's make index 0 span 2 cols on lg screens.
                 index === 0 || index === 5 ? 'lg:col-span-2' : ''
              }`}
              onClick={() => navigate(`/tours/search?q=${dest._id}`)}
            >
              <img 
                src={dest.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                alt={dest._id}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
              
              <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h2 className="text-white text-2xl font-bold mb-1 group-hover:text-blue-200 transition-colors">
                  {dest._id}
                </h2>
                <p className="text-gray-300 text-sm font-medium">
                  {dest.packages} {dest.packages === 1 ? 'Package' : 'Packages'} Available
                </p>
              </div>
            </div>
          ))
        ) : (
           <div className="col-span-full text-center py-12 text-gray-500">
             Loading top destinations...
           </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default Destinations;
