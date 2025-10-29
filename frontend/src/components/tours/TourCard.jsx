import { FaStar } from "react-icons/fa";

const TourCard = ({ tour }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-[250px] justify-self-center">
      <div className="relative">
        <img
          src={tour.mainImage}
          alt={tour.title}
          className="w-full h-[150px] object-cover"
        />
        {tour.tag && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded text-sm">
            {tour.tag}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer">
          {tour.title}
        </h3>
        <div className="flex items-center gap-1 my-2 text-sm text-gray-600">
          {Array.from({ length: tour.rating }, (_, i) => (
            <FaStar
              key={i}
              className="text-yellow-500"
              size={15}
            />
          ))}
        </div>
        <div className="text-lg font-bold text-gray-800">
          From {tour.price.amount} {tour.price.currency}
        </div>
        <div className="text-right text-sm text-gray-600">
          {tour.duration}
        </div>
      </div>
    </div>
  );
};

export default TourCard;
