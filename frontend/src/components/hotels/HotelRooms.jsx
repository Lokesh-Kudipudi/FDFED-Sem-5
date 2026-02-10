import { FaStar, FaChevronRight } from "react-icons/fa";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";

const HotelRooms = ({ rooms, initiateBooking }) => {
  const { state } = useContext(UserContext);

  const handleReserveClick = (room) => {
    if(!state.user){
      toast.error("Please login to book a hotel");
      return;
    }
    initiateBooking(room);
  }
  return (
    <section id="rooms" className="scroll-mt-40">
       <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Select Your Sanctuary</h2>
       <div className="space-y-8">
          {rooms?.map((room, i) => (
            <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col md:flex-row h-auto md:h-80">
               <div className="md:w-5/12 overflow-hidden relative">
                  <img src={room.image} alt={room.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
               </div>
               <div className="p-8 md:w-7/12 flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-start mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 font-serif">{room.title}</h3>
                        <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                           4.9 <FaStar size={10} />
                        </div>
                     </div>
                     <p className="text-gray-500 text-sm mb-6 line-clamp-2">Experience luxury with city views, premium bedding, and soundproof interiors designed for ultimate relaxation.</p>
                     <div className="flex flex-wrap gap-2">
                        {room.features.slice(0, 3).map((f, j) => (
                          <span key={j} className="text-xs border border-gray-200 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">{f}</span>
                        ))}
                     </div>
                  </div>
                  <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-100">
                     <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Avg. Nightly Rate</p>
                        <span className="text-3xl font-bold text-[#003366]">₹{room.price}</span>
                     </div>
                     <button 
                       onClick={() => handleReserveClick(room)}
                       className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-[#003366] transition-colors shadow-lg flex items-center gap-2 group-hover:gap-3"
                     >
                       Reserve <FaChevronRight size={12} />
                     </button>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </section>
  );
};

export default HotelRooms;
