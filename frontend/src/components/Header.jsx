import { useState, useEffect, useRef } from "react";

export default function Header({ user }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

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
          onClick={() => (window.location.href = "/")}
        />

        <nav className="flex gap-8 items-center">
          <a
            className="text-red-600 font-semibold"
            href="/tours"
          >
            Tours
          </a>
          <a
            className="text-red-600 font-semibold"
            href="/hotels"
          >
            Hotels
          </a>
          <a
            className="text-red-600 font-semibold"
            href="/contact"
          >
            Contact Us
          </a>
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
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg ring-1 ring-black/5 py-2">
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href="/dashboard"
                  >
                    Profile
                  </a>
                  {user?.role === "admin" && (
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/dashboard/admin"
                    >
                      Dashboard
                    </a>
                  )}
                  {user?.role === "hotelManager" && (
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/dashboard/hotelManager"
                    >
                      Dashboard
                    </a>
                  )}
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href="/logout"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => (window.location.href = "/signIn")}
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
