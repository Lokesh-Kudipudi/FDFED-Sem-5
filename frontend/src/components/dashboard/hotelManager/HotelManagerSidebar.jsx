import { FaTachometerAlt, FaCalendarAlt, FaBed, FaHotel } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

function HotelManagerSidebar({ collapsed }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <aside
      className={`h-screen bg-slate-800 text-white pt-12 transition-all duration-300 overflow-y-auto flex-shrink-0 ${
        collapsed ? "w-0 opacity-0 overflow-hidden" : "w-64 opacity-100 ml-0"
      }`}
    >
      <div className="text-center py-6 border-b border-slate-700">
        <div className="w-12 h-12 rounded-full bg-purple-500 mx-auto mb-2 flex items-center justify-center text-white font-bold">
          {user?.fullName
            ? user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            : "HM"}
        </div>
        <h5
          onClick={() => navigate("/hotel-manager/dashboard")}
          className="text-pink-400 cursor-pointer text-sm font-semibold"
        >
          {user?.fullName || "Hotel Manager"}
        </h5>
        <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
      </div>

      <div className="text-center py-4 px-4">
        <h3 className="text-purple-400 font-semibold text-sm">DASHBOARD</h3>
      </div>

      <nav className="px-3 space-y-2">
        <button
          onClick={() => navigate("/hotel-manager/dashboard")}
          className="flex items-center gap-3 px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition w-full text-left cursor-pointer"
        >
          <FaTachometerAlt /> Overview
        </button>

        <div>
          <button
            onClick={() => navigate("/hotel-manager/bookings")}
            className="w-full flex items-center justify-between px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition"
          >
            <div className="flex items-center gap-3">
              <FaCalendarAlt /> Bookings
            </div>
          </button>
        </div>

        <a
          onClick={() => navigate("/hotel-manager/room-inventory")}
          className="flex items-center gap-3 px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition cursor-pointer">
          <FaBed /> Room Inventory
        </a>
        <a
          onClick={() => navigate("/hotel-manager/my-hotel")}
          className="flex items-center gap-3 px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition cursor-pointer">
          <FaHotel /> My Hotel
        </a>
      </nav>
    </aside>
  );
}

export default HotelManagerSidebar;
