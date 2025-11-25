import React from "react";
import {
  FaTachometerAlt,
  FaChartBar,
  FaHotel,
  FaQuestionCircle,
  FaUsers,
} from "react-icons/fa";

export const adminSidebarItems = [
  {
    key: "overview",
    label: "Overview",
    path: "/admin/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    key: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: <FaUsers />,
  },
  {
    key: "packages",
    label: "Packages",
    path: "/admin/packages",
    icon: <FaChartBar />,
  },
  {
    key: "hotel-management",
    label: "Hotel Management",
    path: "/admin/hotel-management",
    icon: <FaHotel />,
  },
  {
    key: "queries",
    label: "Queries",
    path: "/admin/queries",
    icon: <FaQuestionCircle />,
  },
];
