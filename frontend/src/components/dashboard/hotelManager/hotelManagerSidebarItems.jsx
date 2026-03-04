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
    key: "my-hotels",
    label: "My Hotels",
    path: "/hotel-manager/my-hotels",
    icon: <FaHotel />,
  },
];
