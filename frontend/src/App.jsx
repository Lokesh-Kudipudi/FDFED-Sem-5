import { Routes, Route } from "react-router-dom";

// Import all your page components here
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignUpHotelManager from "./pages/SignUpHotelManager";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminHotelManagement from "./pages/AdminHotelManagement";
import AdminPackages from "./pages/AdminPackages";

import HotelManagerDashboard from "./pages/HotelManagerDashboard";
import HotelManagerMyHotel from "./pages/HotelManagerMyHotel";
import HotelManagerRoomsIndex from "./pages/HotelManagerRooms";
import HotelManagementBookings from "./pages/HotelManagerBookings";

import UserDashboard from "./pages/UserDashboard";
import HotelsSearch from "./pages/HotelsSearch";
import HotelDetail from "./pages/HotelDetail";
import HotelIndex from "./pages/HotelIndex";
import ToursIndex from "./pages/ToursIndex";
import TourDetail from "./pages/TourDetail";
import Recommendation from "./pages/Recommendation";
import ToursSearch from "./pages/ToursSearch";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route
        path="/auth/signup-hotel-manager"
        element={<SignUpHotelManager />}
      />
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />
      <Route
        path="/admin/customers"
        element={<AdminCustomers />}
      />
      <Route
        path="/admin/hotel-management"
        element={<AdminHotelManagement />}
      />
      <Route
        path="/admin/packages"  
        element={<AdminPackages />}
      />
      <Route
        path="/hotel-manager/dashboard"
        element={<HotelManagerDashboard />}
      />
      <Route
        path="/hotel-manager/room-inventory"
        element={<HotelManagerRoomsIndex />}
      />
      <Route
        path="/hotel-manager/my-hotel"
        element={<HotelManagerMyHotel />}
      />
      <Route
        path="/hotel-manager/bookings"
        element={<HotelManagementBookings />}
      />
      <Route
        path="/user/dashboard"
        element={<UserDashboard />}
      />
      <Route path="/hotels" element={<HotelIndex />} />
      <Route path="/hotels/search" element={<HotelsSearch />} />
      <Route
        path="/hotels/hotel/:id"
        element={<HotelDetail />}
      />
      <Route path="/tours" element={<ToursIndex />} />
      <Route path="/tours/search" element={<ToursSearch />} />
      <Route path="/tours/:id" element={<TourDetail />} />
      <Route
        path="/recommendation"
        element={<Recommendation />}
      />
    </Routes>
  );
}

export default App;
