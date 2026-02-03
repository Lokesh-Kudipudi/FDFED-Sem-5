import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    <section className="relative max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
         {/* Background Image */}
         <div
            className="absolute inset-0 transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-black/50 to-transparent" />

          <div className="relative z-10 p-8 sm:p-12 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <h3 className="text-blue-300 font-bold text-sm tracking-widest uppercase mb-2">
                  Find Your Passion
                </h3>
                <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
                  Top Destinations
                </h1>
                <p className="text-gray-200 max-w-2xl text-lg font-light leading-relaxed">
                  Discover India's most enchanting locations, from tranquil beaches to majestic mountains. 
                  Curated by Chasing Horizons for your next adventure.
                </p>
              </div>
              <button 
                onClick={() => navigate('/tours/search')}
                className="px-8 py-3 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg active:scale-95 whitespace-nowrap"
              >
                Explore All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topDestinations.length > 0 ? (
                topDestinations.map((dest, index) => (
                  <div
                    key={index}
                    className={`relative rounded-2xl overflow-hidden h-72 group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ring-1 ring-white/10 ${
                       index === 0 || index === 5 ? 'lg:col-span-2' : ''
                    }`}
                    onClick={() => navigate(`/tours/${dest.url}`)}
                  >
                    <img 
                      src={dest.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={dest._id}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-0 left-0 p-5 w-full">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h2 className="text-white text-xl font-bold mb-1 group-hover:text-amber-300 transition-colors drop-shadow-md">
                          {dest._id}
                        </h2>
                        <p className="text-gray-200 text-sm font-medium flex items-center gap-2">
                          <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Hot</span>
                          {dest.packages} {dest.packages === 1 ? 'Package' : 'Packages'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                 <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-300">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                   <p>Loading your next adventure...</p>
                 </div>
              )}
            </div>
          </div>
      </div>
    </section>
  );
};

export default Destinations;
