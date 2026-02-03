import AnimatedSection from "../AnimatedSection";
import ItineraryCard from "./ItineraryCard";

export default function ItinerarySection({ randomHotels }) {
  return (
    <AnimatedSection className="py-20 px-6 bg-blue-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#003366]">
            Find your next adventure
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Browse through itineraries and guides crafted by
            fellow travelers. Get inspired by real experiences
            and detailed plans for your next adventure.
          </p>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {randomHotels.length > 0 ? (
          randomHotels.map((hotel) => (
            <div 
              key={hotel._id} 
            >
              <ItineraryCard
                title={hotel.title}
                description={hotel.description ? hotel.description.substring(0, 100) + "..." : "Experience luxury and comfort."}
                image={hotel.mainImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                href={`/hotels/hotel/${hotel._id}`}
              />
            </div>
          ))
        ) : (
           <div className="col-span-3 text-center text-gray-500">Loading adventures...</div>
        )}
      </div>
    </AnimatedSection>
  );
}
