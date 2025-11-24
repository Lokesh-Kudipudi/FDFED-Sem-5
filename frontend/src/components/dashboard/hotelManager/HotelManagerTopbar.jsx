import React from "react";
import { FaBars } from "react-icons/fa";

export default function HotelManagerTopbar({ sidebarCollapsed, setSidebarCollapsed }) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="p-2 rounded hover:bg-slate-700 transition"
      >
        <FaBars className="text-white" size={20} />
      </button>

      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold cursor-pointer">
        HM
      </div>
    </div>
  );
}
