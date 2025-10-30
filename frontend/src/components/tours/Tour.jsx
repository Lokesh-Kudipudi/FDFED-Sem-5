// Tour.jsx
import Header from "../Header";
import Footer from "../Footer";
import HeroSection from "./TourHeroSection";
import PlacesToVisit from "./PlacesToVisit";
import Itinerary from "./Itinerary";
import IncludedSection from "./IncludedSection";
import BookingSection from "./BookingSection";

const Tour = ({ tour }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mt-16 mx-auto px-5 py-8">
        <h2 className="text-5xl font-bold">{tour.title}</h2>
        <p className="mt-2 text-gray-600">
          {tour.duration} • From{" "}
          <strong>{tour.startLocation}</strong>
        </p>
        <p className="mt-2 text-gray-500">{tour.description}</p>

        <HeroSection tour={tour} />
        <PlacesToVisit destinations={tour.destinations} />
        <Itinerary itinerary={tour.itinerary} />
        <IncludedSection includes={tour.includes} />
        <BookingSection
          tour={tour}
          availableMonths={tour.availableMonths}
          bookingDetails={tour.bookingDetails}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Tour;
