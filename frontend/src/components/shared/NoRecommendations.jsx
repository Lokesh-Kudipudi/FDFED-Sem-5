import React from 'react';
import { FaSearchLocation } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NoRecommendations = ({ 
  title = "No Recommendations Found", 
  message = "We couldn't find any tours or hotels matching your preferences.",
  showButton = true,
  buttonText = "Explore All Options"
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-slide-up">
      <div className="bg-gray-50 rounded-full p-8 mb-6 shadow-sm border border-gray-100">
        <FaSearchLocation className="text-6xl text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        {title}
      </h2>
      
      <p className="text-gray-500 text-center max-w-md mb-8 leading-relaxed">
        {message}
      </p>

      {showButton && (
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default NoRecommendations;
