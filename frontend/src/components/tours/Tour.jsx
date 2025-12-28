import Header from "../Header";
import Footer from "../Footer";
import HeroSection from "./TourHeroSection";
import PlacesToVisit from "./PlacesToVisit";
import Itinerary from "./Itinerary";
import IncludedSection from "./IncludedSection";
import BookingSection from "./BookingSection";

const Tour = ({ tour }) => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Header />
      
      {/* Full Width Hero */}
      <HeroSection tour={tour} />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Content Column (Left - 66%) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview / Description */}
            <section id="overview" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#003366] mb-4 border-b border-gray-100 pb-2">Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {tour.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                 {tour.tags && tour.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                       {tag}
                    </span>
                 ))}
                 <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    {tour.language || 'English'}
                 </span>
              </div>
            </section>

            <PlacesToVisit destinations={tour.destinations} />
            <Itinerary itinerary={tour.itinerary} />
            <IncludedSection includes={tour.includes} />
            
            {/* Policy Section (Static for now) */}
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-2xl font-bold text-[#003366] mb-4 border-b border-gray-100 pb-2">Cancellation Policy</h2>
               <p className="text-gray-500 text-sm leading-relaxed">
                 Free cancellation up to 7 days before departure. 50% refund up to 48 hours before departure. No refunds for cancellations within 48 hours.
               </p>
            </section>
          </div>

          {/* Sticky Sidebar Booking Column (Right - 33%) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 z-30">
               <BookingSection
                 tour={tour}
                 availableMonths={tour.availableMonths}
                 bookingDetails={tour.bookingDetails}
               />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tour;
