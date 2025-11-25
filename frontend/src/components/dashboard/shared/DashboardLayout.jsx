import React from "react";
import DashboardTopbar from "./DashboardTopbar";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({ title, sidebarItems, activeItem, onItemClick, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col h-screen">
      <DashboardTopbar title={title} />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar items={sidebarItems} activeItem={activeItem} onItemClick={onItemClick} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
