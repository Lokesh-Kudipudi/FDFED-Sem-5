import React from "react";
import {
  FaTachometerAlt,
  FaChartBar,
  FaHotel,
  FaQuestionCircle,
} from "react-icons/fa";

export default function Sidebar({ collapsed = false, onToggle = () => {} }) {
  return (
    <aside
      className={`bg-[#2c3e50] text-white h-screen transition-all duration-300 flex-shrink-0 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className="p-4 cursor-pointer text-lg font-bold flex items-center justify-between"
        onClick={() => (window.location.href = "/")}
      >
        <span className={`${collapsed ? "hidden" : "inline-block"}`}>
          Chasing Horizons
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="p-1 rounded hover:bg-white/10"
          title="Toggle"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <nav className="mt-2">
        <a
          href="/dashboard/admin"
          className={`flex items-center gap-3 px-4 py-3 hover:bg-[#34495e] ${
            !collapsed ? "justify-start" : "justify-center"
          }`}
        >
          <FaTachometerAlt />
          {!collapsed && <span>Overview</span>}
        </a>

        <a
          href="/dashboard/admin/packages"
          className={`flex items-center gap-3 px-4 py-3 hover:bg-[#34495e] ${
            !collapsed ? "justify-start" : "justify-center"
          }`}
        >
          <FaChartBar />
          {!collapsed && <span>Packages</span>}
        </a>

        <a
          href="/dashboard/admin/hotelManagement"
          className={`flex items-center gap-3 px-4 py-3 hover:bg-[#34495e] ${
            !collapsed ? "justify-start" : "justify-center"
          }`}
        >
          <FaHotel />
          {!collapsed && <span>Hotel Management</span>}
        </a>

        <a
          href="/dashboard/admin/queries"
          className={`flex items-center gap-3 px-4 py-3 hover:bg-[#34495e] ${
            !collapsed ? "justify-start" : "justify-center"
          }`}
        >
          <FaQuestionCircle />
          {!collapsed && <span>Queries</span>}
        </a>
      </nav>
    </aside>
  );
}