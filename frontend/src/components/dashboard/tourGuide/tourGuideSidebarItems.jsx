import React from "react";
import { FaTachometerAlt, FaCalendarAlt, FaMapMarkedAlt, FaPlusCircle } from "react-icons/fa";

export const tourGuideSidebarItems = [
  {
    key: "overview",
    label: "Overview",
    path: "/tour-guide/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    key: "my-tours",
    label: "My Tours",
    path: "/tour-guide/my-tours",
    icon: <FaMapMarkedAlt />,
  },
  {
    key: "create-tour",
    label: "Create Tour",
    path: "/tour-guide/create-tour",
    icon: <FaPlusCircle />,
  },
  {
    key: "bookings",
    label: "Bookings",
    path: "/tour-guide/bookings",
    icon: <FaCalendarAlt />,
  },
];
