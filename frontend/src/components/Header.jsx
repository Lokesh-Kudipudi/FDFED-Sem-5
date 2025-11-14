import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <header className="w-full fixed top-4 left-0 z-40 px-4">
      <div className="max-w-4/5  mx-auto backdrop-blur rounded-3xl p-4 flex items-center justify-between">
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-12 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <nav className="flex gap-8 items-center">
          <Link
            className="text-red-600 font-semibold"
            to="/tours"
          >
            Tours
          </Link>
          <Link
            className="text-red-600 font-semibold"
            to="/hotels"
          >
            Hotels
          </Link>
          <Link
            className="text-red-600 font-semibold"
            to="/contact"
          >
            Contact Us
          </Link>
        </nav>

        <div className="relative" ref={menuRef}>
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                  user.fullName || "user"
                )}`}
                alt="avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setOpen((s) => !s)}
              />
              {open && (
                <div className="absolute top-12 right-0 mt-2 w-44 bg-white rounded-lg shadow-lg ring-1 ring-black/5 py-2">
                  <Link
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    to="/user/dashboard"
                  >
                    Profile
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      to="/admin/dashboard"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user?.role === "hotelManager" && (
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      to="/hotel-manager/dashboard"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    className="block px-4 py-2 text-sm w-full text-left hover:cursor-pointer text-gray-700 hover:bg-gray-100"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth/signin")}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
