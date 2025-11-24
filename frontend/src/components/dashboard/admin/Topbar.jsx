import React from "react";
import { FaBars } from "react-icons/fa";

export default function Topbar({ onToggleSidebar = () => {} }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        {/* Optional search - leave disabled by default */}
        {/* <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <input className="bg-transparent outline-none ml-2 text-sm" placeholder="Search..." />
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Uncomment if you want a badge */}
          {/* <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">3</div> */}
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            AD
          </div>
        </div>
        <div className="text-sm text-gray-700">Admin</div>
      </div>
    </div>
  );
}