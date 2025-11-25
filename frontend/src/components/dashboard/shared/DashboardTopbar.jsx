import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardTopbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center z-10 relative">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/images/logo.png"
          alt="Chasing Horizons Logo"
          className="h-10 w-10"
        />
        <h1 className="text-xl font-semibold text-black">
          Chasing Horizons
        </h1>
      </div>
      <span className="text-sm text-gray-600 font-medium">
        {title}
      </span>
    </header>
  );
};

export default DashboardTopbar;
