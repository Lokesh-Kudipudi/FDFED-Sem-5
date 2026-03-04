import React from "react";
import { FaTachometerAlt, FaHotel, FaMapMarkedAlt, FaCalendarAlt } from "react-icons/fa";

export const employeeSidebarItems = [
  {
    key: "overview",
    label: "Overview",
    path: "/employee/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    key: "hotels",
    label: "Assigned Hotels",
    path: "/employee/hotels",
    icon: <FaHotel />,
  },
  {
    key: "tours",
    label: "Assigned Tours",
    path: "/employee/tours",
    icon: <FaMapMarkedAlt />,
  },
  {
    key: "bookings",
    label: "Bookings",
    path: "/employee/bookings",
    icon: <FaCalendarAlt />,
  },
];
