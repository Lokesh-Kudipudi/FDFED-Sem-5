import React from "react";
import {
  FaTachometerAlt,
  FaChartBar,
  FaHotel,
  FaQuestionCircle,
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
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
    key: "tour-guides",
    label: "Tour Guides",
    path: "/admin/tour-guides",
    icon: <FaUserTie />,
  },
  {
    key: "hotel-managers",
    label: "Hotel Managers",
    path: "/admin/hotel-managers",
    icon: <FaUserTie />,
  },
  {
    key: "bookings",
    label: "All Bookings",
    path: "/admin/bookings",
    icon: <FaCalendarAlt />,
  },
  {
    key: "queries",
    label: "Queries",
    path: "/admin/queries",
    icon: <FaQuestionCircle />,
  },
];
