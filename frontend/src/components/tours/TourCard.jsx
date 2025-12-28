import { FaStar, FaMapMarkerAlt, FaClock, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const TourCard = ({ tour }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Use mainImage and any additional images from the tour object
  // Fallback to mainImage if images array is empty or undefined
  const images = tour.images && tour.images.length > 0 ? tour.images : [tour.mainImage];

  useEffect(() => {
    let interval;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1500); // Change image every 1.5 seconds on hover
    } else {
      setCurrentImageIndex(0); // Reset to first image when not hovered
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group w-full max-w-sm cursor-pointer border border-gray-100 flex flex-col h-full"
      onClick={() => navigate(`/tours/${tour._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        {/* Image Carousel */}
        <img
          src={images[currentImageIndex] || tour.mainImage}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex gap-2">
          {tour.tag && (
            <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
              {tour.tag}
            </span>
          )}
        </div>

        {/* Wishlist Button (Visual Only for now) */}
        <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
          <FaHeart size={14} />
        </button>

        {/* Location & Duration on Image */}
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
            <FaMapMarkerAlt className="text-blue-400" />
            {tour.startLocation}
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow relative">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#003366] transition-colors line-clamp-2 min-h-[3.5rem]">
          {tour.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
           <div className="flex items-center gap-1">
             <FaClock className="text-blue-500/70" />
             {tour.duration}
           </div>
           
           <div className="flex items-center gap-1 text-yellow-500">
             <FaStar />
             <span className="font-semibold text-gray-700">{tour.rating || 4.5}</span>
             <span className="text-gray-400 font-normal">({tour.reviews || 12} reviews)</span>
           </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Starting From</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#003366]">
                {tour.price.currency || "₹"} {tour.price.amount?.toLocaleString()}
              </span>
            </div>
          </div>
          
          <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-[#003366] group-hover:text-white transition-all duration-300">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
