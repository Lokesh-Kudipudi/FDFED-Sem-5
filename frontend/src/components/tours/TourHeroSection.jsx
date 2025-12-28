// components/HeroSection.jsx
const HeroSection = ({ tour }) => {
  return (
    <div className="flex gap-6 mt-6">
      <div className="flex-1">
        <img
          src={tour.mainImage}
          alt="tour"
          className="w-full h-[400px] object-cover rounded-2xl"
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {tour.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="w-[300px]">
        <div className="bg-white rounded-lg shadow-lg p-5">
          <div className="flex justify-between items-center">
            <span className="line-through text-gray-500">
              From {tour.price.amount} {tour.price.currency}
            </span>
            <span className="bg-red-500 text-white px-3 py-1 rounded text-sm">
              -{tour.price.discount * 100}%
            </span>
          </div>
          <div className="text-2xl font-bold mt-2">
            {tour.price.currency}{" "}
            {tour.price.amount -
              tour.price.discount * tour.price.amount}
          </div>
          <a
            href="#choice-section"
            className="block text-center bg-[#0077b6] hover:bg-[#026aa2] text-white py-2 px-4 rounded-full font-bold mt-3"
          >
            Check Availability
          </a>
          <p className="text-sm text-gray-500 mt-3">
            Price based on per person in Standard for departure
            on {tour.bookingDetails?.[0]?.startDate || "request"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default HeroSection;
