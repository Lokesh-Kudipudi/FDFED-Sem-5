import React from "react";
import {
  FaTachometerAlt,
  FaChartBar,
  FaHotel,
  FaQuestionCircle,
  FaUsers,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router";

export default function Sidebar({ collapsed = false }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`bg-[#2c3e50] text-white h-screen transition-all duration-300 flex-shrink-0 overflow-hidden ${
        collapsed ? "w-0 p-0" : "w-64"
      }`}
    >
      <div
        className="p-4 cursor-pointer text-lg font-bold flex items-center justify-between whitespace-nowrap"
        onClick={() => navigate("/")}
      >
        <span
          className="inline-block"
        >
          Chasing Horizons
        </span>
      </div>

      <nav className="mt-2">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#34495e] whitespace-nowrap"
        >
          <FaTachometerAlt className="min-w-[16px]" />
          <span>Overview</span>
        </Link>

        <Link
          to="/admin/customers"
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#34495e] whitespace-nowrap"
        >
          <FaUsers className="min-w-[16px]" />
          <span>Customers</span>
        </Link>

        <Link
          to="/admin/packages"
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#34495e] whitespace-nowrap"
        >
          <FaChartBar className="min-w-[16px]" />
          <span>Packages</span>
        </Link>

        <Link
          to="/admin/hotel-management"
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#34495e] whitespace-nowrap"
        >
          <FaHotel className="min-w-[16px]" />
          <span>Hotel Management</span>
        </Link>

        <Link
          to="/admin/queries"
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#34495e] whitespace-nowrap"
        >
          <FaQuestionCircle className="min-w-[16px]" />
          <span>Queries</span>
        </Link>
      </nav>
    </aside>
  );
}
