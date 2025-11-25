import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardSidebar = ({ items = [], activeItem, onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-full overflow-y-auto hidden md:flex">
      {items.map((item) => {
        // Determine if active
        // If activeItem is provided, use it.
        // Otherwise, check path.
        let isActive = false;
        if (activeItem) {
            isActive = activeItem === item.key;
        } else if (item.path) {
            isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
        }

        return (
          <button
            key={item.key || item.path}
            onClick={() => {
              if (item.path) {
                navigate(item.path);
              }
              if (onItemClick) {
                onItemClick(item.key || item.path);
              }
            }}
            className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition flex items-center gap-3 ${
              isActive
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export default DashboardSidebar;
