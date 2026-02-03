import HotelCarousel from "./HotelCarousel";
import HotelCard from "./HotelCard";

const HotelDeals = ({ navigate, loading, topDeals }) => {
  return (
    <section className="relative max-w-7xl mx-auto mt-12 mb-16 px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <div
          className="absolute inset-0 transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage:
              'url("https://forever.travel-assets.com/flex/flexmanager/mediaasset/1191089-0_2-qRvKdMx.jpg?impolicy=fcrop&w=1600&h=700&p=1&q=high")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 p-8 sm:p-12 text-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                Top deals for a last minute getaway
              </h3>
              <p className="text-gray-200 text-lg font-medium">
                 Unbeatable prices for your next adventure.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Limited time offer: 12 Mar - 14 Mar
              </p>
            </div>
            <button 
              onClick={() => navigate('/hotels/search')}
              className="px-6 py-2.5 bg-white text-blue-900 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg active:scale-95"
            >
              View All Deals
            </button>
          </div>

          <div className="mt-4">
            <HotelCarousel
              items={(loading
                ? Array.from({ length: 6 }).map((_, i) => ({
                    key: `s${i}`,
                    skeleton: true,
                  }))
                : topDeals
              ).map((hotelOrSkel, idx) => {
                if (hotelOrSkel?.skeleton) {
                  return {
                    key: hotelOrSkel.key,
                    content: (
                      <div className="w-[280px] bg-white/5 rounded-xl p-3 animate-pulse border border-white/10">
                        <div className="h-40 rounded-lg bg-white/10" />
                        <div className="mt-4 h-4 w-3/4 bg-white/10 rounded" />
                        <div className="mt-2 h-3 w-1/2 bg-white/10 rounded" />
                      </div>
                    ),
                  };
                }
                const h = hotelOrSkel;
                return {
                  key: `${h.id || h._id || idx}`,
                  content: (
                    <div className="w-[280px] transform hover:-translate-y-1 transition-transform duration-300">
                       {/* Pass a prop or style to HotelCard if needed, or wrap it */}
                      <div className="rounded-xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors">
                        <HotelCard hotel={h} dark />
                      </div>
                    </div>
                  ),
                };
              })}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelDeals;
