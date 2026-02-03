import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function onDoc(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {user ? (
        <div className="flex items-center gap-3">
          <div className="group relative">
            {/* Better Default Avatar */}
            <div className="w-10 h-10 rounded-full cursor-pointer bg-gradient-to-br from-[#003366] to-[#0055aa] flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 ring-2 ring-transparent hover:ring-white/30 overflow-hidden"
              onClick={() => setOpen((s) => !s)}
            >
              {user.photo ? (
                <img src={user.photo} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{user.fullName?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>
          </div>
          
          {/* Animated Dropdown */}
          {open && (
            <>
              {/* Backdrop with fade */}
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
              
              <div 
                className="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                style={{
                  animation: 'slideDown 0.2s ease-out',
                  transformOrigin: 'top right'
                }}
              >
                {/* User Info Section with Gradient */}
                <div className="bg-gradient-to-br from-[#003366] to-[#0055aa] p-4 relative overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                  </div>
                  
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 overflow-hidden">
                      {user.photo ? (
                        <img src={user.photo} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-white text-lg" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate text-sm">{user.fullName}</div>
                      <div className="text-xs text-white/80 truncate">{user.email}</div>
                    </div>
                  </div>
                </div>

                {/* Menu Items with stagger animation */}
                <div className="py-2">
                  <Link
                    to="/user/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#003366] transition-all group"
                    style={{ animation: 'fadeIn 0.3s ease-out 0.05s backwards' }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#003366] flex items-center justify-center transition-colors">
                      <FaUser className="text-gray-600 group-hover:text-white transition-colors text-sm" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </Link>
                  
                  {user?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#003366] transition-all group"
                      style={{ animation: 'fadeIn 0.3s ease-out 0.1s backwards' }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#003366] flex items-center justify-center transition-colors">
                        <FaTachometerAlt className="text-gray-600 group-hover:text-white transition-colors text-sm" />
                      </div>
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                  )}
                  
                  {user?.role === "hotelManager" && (
                    <Link
                      to="/hotel-manager/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#003366] transition-all group"
                      style={{ animation: 'fadeIn 0.3s ease-out 0.1s backwards' }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#003366] flex items-center justify-center transition-colors">
                        <FaTachometerAlt className="text-gray-600 group-hover:text-white transition-colors text-sm" />
                      </div>
                      <span className="font-medium">Manager Dashboard</span>
                    </Link>
                  )}
                  
                  {user?.role === "tourGuide" && (
                    <Link
                      to="/tour-guide/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#003366] transition-all group"
                      style={{ animation: 'fadeIn 0.3s ease-out 0.1s backwards' }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#003366] flex items-center justify-center transition-colors">
                        <FaTachometerAlt className="text-gray-600 group-hover:text-white transition-colors text-sm" />
                      </div>
                      <span className="font-medium">Guide Dashboard</span>
                    </Link>
                  )}

                  <div className="border-t border-gray-100 my-2"></div>
                  
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm w-full text-left text-red-600 hover:bg-red-50 transition-all group"
                    style={{ animation: 'fadeIn 0.3s ease-out 0.15s backwards' }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-600 flex items-center justify-center transition-colors">
                      <FaSignOutAlt className="text-red-600 group-hover:text-white transition-colors text-sm" />
                    </div>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/auth/signin")}
          className="bg-[#003366] text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition-all shadow-md hover:shadow-lg hover:scale-105 transform"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
