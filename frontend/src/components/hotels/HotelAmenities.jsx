import { 
    FaWifi, FaSwimmingPool, FaUtensils, FaSpa, FaDumbbell, FaConciergeBell 
  } from "react-icons/fa";
  
  const HotelAmenities = ({ amenities }) => {
    const getAmenityIcon = (name) => {
      const lower = name?.toLowerCase() || "";
      if (lower.includes("wifi")) return <FaWifi />;
      if (lower.includes("pool")) return <FaSwimmingPool />;
      if (lower.includes("dining") || lower.includes("breakfast")) return <FaUtensils />;
      if (lower.includes("spa")) return <FaSpa />;
      if (lower.includes("gym") || lower.includes("fitness")) return <FaDumbbell />;
      return <FaConciergeBell />;
    };
  
    return (
      <section id="amenities" className="scroll-mt-40">
         <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Curated Amenities</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities?.map((am, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300 group">
                 <span className="text-[#003366] text-3xl mb-3 group-hover:scale-110 transition-transform">{getAmenityIcon(am)}</span>
                 <span className="text-gray-600 font-medium text-center text-sm">{am}</span>
              </div>
            ))}
         </div>
      </section>
    );
  };
  
  export default HotelAmenities;
