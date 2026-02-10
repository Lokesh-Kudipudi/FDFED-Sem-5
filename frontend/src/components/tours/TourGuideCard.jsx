import React from 'react';

const TourGuideCard = ({ guide }) => {
  if (!guide) return null;
  // If guide is just an ID (string) or empty object, don't show partially
  if (typeof guide !== 'object' || !guide.fullName) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h3 className="text-xl font-bold text-[#003366] mb-6 border-b border-gray-100 pb-2">
        Your Tour Guide
      </h3>
      
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={guide.photo || "https://ui-avatars.com/api/?name=" + guide.fullName} 
          alt={guide.fullName}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-800">{guide.fullName}</h4>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-600">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">{guide.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-sm">{guide.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default TourGuideCard;
