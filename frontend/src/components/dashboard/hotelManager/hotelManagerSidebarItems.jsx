import React from "react";
import { FaTachometerAlt, FaCalendarAlt, FaBed, FaHotel } from "react-icons/fa";

export const hotelManagerSidebarItems = [
  {
    key: "overview",
    label: "Overview",
    path: "/hotel-manager/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    key: "bookings",
    label: "Bookings",
    path: "/hotel-manager/bookings",
    icon: <FaCalendarAlt />,
  },
  {
    key: "room-inventory",
    label: "Room Inventory",
    path: "/hotel-manager/room-inventory",
    icon: <FaBed />,
  },
  {
    key: "my-hotel",
    label: "My Hotel",
    path: "/hotel-manager/my-hotel",
    icon: <FaHotel />,
  },
];
