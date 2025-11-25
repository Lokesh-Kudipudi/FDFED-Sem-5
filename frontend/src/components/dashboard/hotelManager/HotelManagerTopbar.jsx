import React from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HotelManagerTopbar({ sidebarCollapsed, setSidebarCollapsed }) {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="p-2 rounded hover:bg-slate-700 transition"
      >
        <FaBars className="text-white" size={20} />
      </button>
      <h2
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-purple-400 text-center cursor-pointer">
          Chasing Horizons
        </h2>
    </div>
  );
}
