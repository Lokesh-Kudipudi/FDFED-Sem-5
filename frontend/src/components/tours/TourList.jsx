import TourCard from "./TourCard";

const TourList = ({ tours }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center pb-20">
      {tours.map((tour, index) => (
        <div 
          key={tour._id} 
          className="w-full animate-slide-up opacity-0 fill-mode-forwards"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <TourCard tour={tour} />
        </div>
      ))}
    </div>
  );
};

export default TourList;
