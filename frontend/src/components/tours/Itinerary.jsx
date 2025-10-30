// components/Itinerary.jsx
import { useState } from "react";

const ItineraryItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg grid grid-cols-[auto_1fr_auto] gap-x-6 gap-y-8 items-center ${
        isOpen ? "border-t-4 border-[#087f5b]" : ""
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span
        className={`text-2xl font-medium ${
          isOpen ? "text-[#087f5b]" : "text-gray-300"
        }`}
      >
        {item.day}
      </span>
      <p
        className={`text-2xl font-medium ${
          isOpen ? "text-[#087f5b]" : ""
        }`}
      >
        {item.location}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 stroke-[#087f5b] cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
      {isOpen && (
        <ul className="col-start-2 text-gray-600 list-disc pl-5 space-y-1">
          {item.activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Itinerary = ({ itinerary }) => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">Itinerary</h2>
      <div className="mt-6 flex flex-col gap-6 max-w-[700px]">
        {itinerary.map((item, index) => (
          <ItineraryItem key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Itinerary;
