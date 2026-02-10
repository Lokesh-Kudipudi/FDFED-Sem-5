import React from 'react';

const Loader = ({ size = "medium", color = "blue" }) => {
  const sizeClasses = {
    small: "w-5 h-5 border-2",
    medium: "w-10 h-10 border-4",
    large: "w-16 h-16 border-4"
  };

  const colorClasses = {
    blue: "border-blue-600 border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-600 border-t-transparent"
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default Loader;
