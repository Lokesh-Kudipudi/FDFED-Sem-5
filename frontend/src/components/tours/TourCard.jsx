import { FaStar, FaMapMarkerAlt, FaClock, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import useAuth from "../../hooks/useAuth";  
import toast from "react-hot-toast";
import { API } from "../../config/api";

const TourCard = ({ tour, onFavouriteChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const images = tour.images && tour.images.length > 0 ? tour.images : [tour.mainImage];

    const checkFavouriteStatus = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch(API.FAVOURITES.CHECK(tour._id), {
        credentials: "include",
      });
      
      if (!response.ok) {
        // If 404 or other error, just set to false
        setIsFavourited(false);
        return;
      }
      
      const data = await response.json();
      if (data.status === "success") {
        setIsFavourited(data.isFavourited);
      }
    } catch (error) {
      console.error("Error checking favourite:", error);
      setIsFavourited(false);
    }
  }, [tour._id, user]);
  // Check if tour is favourited on mount
  useEffect(() => {
    if (user) {
      checkFavouriteStatus();
    } else {
      setIsFavourited(false);
    }
  }, [user, checkFavouriteStatus]);

  useEffect(() => {
    let interval;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);



  const toggleFavourite = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to add favourites");
      return;
    }

    setIsLoading(true);
    try {
      if (isFavourited) {
        // Remove from favourites
        const response = await fetch(API.FAVOURITES.REMOVE(tour._id), {
          method: "DELETE",
          credentials: "include",
        });
        const data = await response.json();
        if (data.status === "success") {
          setIsFavourited(false);
          toast.success("Removed from favourites");
          if (onFavouriteChange) onFavouriteChange();
        }
      } else {
        // Add to favourites
        const response = await fetch(API.FAVOURITES.LIST, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ tourId: tour._id }),
        });
        const data = await response.json();
        if (data.status === "success") {
          setIsFavourited(true);
          toast.success("Added to favourites");
          if (onFavouriteChange) onFavouriteChange();
        }
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
      toast.error("Failed to update favourite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group w-full max-w-sm cursor-pointer border border-gray-100 flex flex-col h-full"
      onClick={() => navigate(`/tours/${tour._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={images[currentImageIndex] || tour.mainImage}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        <div className="absolute top-4 left-4 flex gap-2">
          {tour.tag && (
            <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
              {tour.tag}
            </span>
          )}
        </div>

        {/* Favourite Button */}
        <button 
          onClick={toggleFavourite}
          disabled={isLoading}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isFavourited 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/20 text-white hover:bg-white hover:text-red-500 hover:scale-110'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaHeart size={14} className={isFavourited ? 'animate-pulse' : ''} />
        </button>

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
           
           <div className="flex items-center gap-1">
             <div className="flex items-center gap-1 text-yellow-500">
               <FaStar />
               <span className="font-semibold text-gray-700">{tour.rating || 4.5}</span>
             </div>
             {(tour.reviewsCount > 0 || tour.numReviews > 0) && (
               <span className="text-gray-400 text-xs">
                 ({tour.reviewsCount || tour.numReviews} reviews)
               </span>
             )}
           </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-xs block">Starting from</span>
              <span className="text-2xl font-bold text-[#003366]">
                ₹{tour.price?.amount?.toLocaleString("en-IN") || "N/A"}
              </span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tours/${tour._id}`);
              }}
              className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-900 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
