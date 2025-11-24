import { useNavigate } from "react-router";

export default function ItineraryCard({
  title,
  image,
  description,
  href,
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition transform hover:-translate-y-1">
      <img
        src={image}
        alt={title}
        className="w-full h-44 object-cover"
      />
      <div className="p-4">
        <h3
          onClick={() => (navigate(href))}
          className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
        >
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}
