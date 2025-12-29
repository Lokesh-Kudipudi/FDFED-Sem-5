import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

export default function Header() {
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
    <header className="w-full fixed top-0 left-0 z-40">
      <div className="w-full backdrop-blur-md bg-white/90 border-b border-gray-200 p-4 flex items-center justify-between shadow-md">
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-12 cursor-pointer hover:scale-110 transition-transform duration-300"
          onClick={() => navigate("/")}
        />

        <nav className="flex gap-8 items-center">
          <Link
            className="text-gray-700 font-semibold hover:text-[#003366] transition-colors relative group"
            to="/tours"
          >
            Tours
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#003366] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            className="text-gray-700 font-semibold hover:text-[#003366] transition-colors relative group"
            to="/hotels/search"
          >
            Hotels
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#003366] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            className="text-gray-700 font-semibold hover:text-[#003366] transition-colors relative group"
            to="/contact"
          >
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#003366] group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        <div className="relative" ref={menuRef}>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="group">
                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                    user.fullName || "user"
                  )}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-transparent group-hover:ring-[#003366] transition-all duration-300 hover:scale-110"
                  onClick={() => setOpen((s) => !s)}
                />
              </div>
              {open && (
                <div 
                  className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-down"
                  style={{ transformOrigin: 'top right' }}
                >
                  <div className="py-2">
                    <Link
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#003366] transition-all group"
                      to="/user/dashboard"
                      onClick={() => setOpen(false)}
                    >
                      <FaUser className="text-gray-400 group-hover:text-[#003366] transition-colors" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    
                    {(user?.role === "admin" || user?.role === "hotelManager" || user?.role === "tourGuide") && (
                      <Link
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#003366] transition-all group"
                        to={
                          user?.role === "admin" ? "/admin/dashboard" :
                          user?.role === "hotelManager" ? "/hotel-manager/dashboard" :
                          "/tour-guide/dashboard"
                        }
                        onClick={() => setOpen(false)}
                      >
                        <FaTachometerAlt className="text-gray-400 group-hover:text-[#003366] transition-colors" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    )}
                    
                    <button
                      className="flex items-center gap-3 px-4 py-3 text-sm w-full text-left hover:cursor-pointer text-red-600 hover:bg-red-50 transition-all group"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      <FaSignOutAlt className="text-red-400 group-hover:text-red-600 transition-colors" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
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
      </div>
    </header>
  );
}
