import React from "react";
import {
  FaTachometerAlt,
  FaChartBar,
  FaHotel,
  FaQuestionCircle,
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaCheckCircle,
} from "react-icons/fa";

export const adminSidebarItems = [
  {
    key: "overview",
    label: "Overview",
    path: "/admin/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    key: "employees",
    label: "Employees",
    path: "/admin/employees",
    icon: <FaUsers />,
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
    key: "hotels",
    label: "Hotel Management",
    path: "/admin/hotel-management",
    icon: <FaHotel />,
  },
  {
    key: "tours",
    label: "Packages Management",
    path: "/admin/packages",
    icon: <FaMapMarkedAlt />,
  },
  {
    key: "verifications",
    label: "Verifications",
    path: "/admin/verifications",
    icon: <FaCheckCircle />,
  },
  {
    key: "queries",
    label: "Queries",
    path: "/admin/queries",
    icon: <FaQuestionCircle />,
  },
  {
    key: "reports",
    label: "Earnings",
    path: "/admin/reports",
    icon: <FaChartBar />,
  },
];
