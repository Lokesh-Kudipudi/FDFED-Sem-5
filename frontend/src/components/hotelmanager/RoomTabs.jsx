import React from 'react';

export default function RoomTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-8 border-b border-gray-100 pb-0">
        <button 
        onClick={() => setActiveTab("physical")}
        className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-4 transition-all ${activeTab === "physical" ? "border-[#003366] text-[#003366]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
            Physical Rooms
        </button>
        <button 
        onClick={() => setActiveTab("types")}
        className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-4 transition-all ${activeTab === "types" ? "border-[#003366] text-[#003366]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
            Room Types
        </button>
    </div>
  );
}
