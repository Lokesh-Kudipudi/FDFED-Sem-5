import { FaCheck } from "react-icons/fa";

const HotelOverview = ({ description }) => {
  return (
    <section id="overview" className="scroll-mt-40">
       <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">The Experience</h2>
       <p className="text-gray-600 leading-8 text-lg font-light tracking-wide first-letter:text-5xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-[#003366]">
         {description}
       </p>
       <div className="mt-8 flex gap-6">
          <div className="flex items-center gap-3 text-sm font-bold text-[#003366] bg-blue-50 px-5 py-3 rounded-full border border-blue-100">
             <FaCheck className="text-lg" /> Free Cancellation
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-[#003366] bg-blue-50 px-5 py-3 rounded-full border border-blue-100">
             <FaCheck className="text-lg" /> Pay at Hotel
          </div>
       </div>
    </section>
  );
};

export default HotelOverview;
