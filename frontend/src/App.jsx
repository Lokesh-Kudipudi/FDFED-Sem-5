import { Routes, Route } from "react-router-dom";

// Import all your page components here
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignUpHotelManager from "./pages/SignUpHotelManager";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminCustomers from "./pages/AdminCustomers";
import AdminHotelManagement from "./pages/AdminHotelManagement";
import AdminPackage from "./pages/AdminPackage";
import AdminPackages from "./pages/AdminPackages";
import HotelManagerDashboard from "./pages/HotelManagerDashboard";
import HotelManagerBooking from "./pages/HotelManagerBooking";
import HotelManagerRoomsAdd from "./pages/HotelManagerRoomsAdd";
import HotelManagerRoomsIndex from "./pages/HotelManagerRoomsIndex";
import UserDashboard from "./pages/UserDashboard";
import UserMyTrips from "./pages/UserMyTrips";
import UserSettings from "./pages/UserSettings";
import HotelsIndex from "./pages/HotelsIndex";
import HotelDetail from "./pages/HotelDetail";
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
        path="/admin/analytics"
        element={<AdminAnalytics />}
      />
      <Route
        path="/admin/customers"
        element={<AdminCustomers />}
      />
      <Route
        path="/admin/hotel-management"
        element={<AdminHotelManagement />}
      />
      <Route path="/admin/package" element={<AdminPackage />} />
      <Route
        path="/admin/packages"
        element={<AdminPackages />}
      />
      <Route
        path="/hotel-manager/dashboard"
        element={<HotelManagerDashboard />}
      />
      <Route
        path="/hotel-manager/booking"
        element={<HotelManagerBooking />}
      />
      <Route
        path="/hotel-manager/rooms/add"
        element={<HotelManagerRoomsAdd />}
      />
      <Route
        path="/hotel-manager/rooms"
        element={<HotelManagerRoomsIndex />}
      />
      <Route
        path="/user/dashboard"
        element={<UserDashboard />}
      />
      <Route path="/user/my-trips" element={<UserMyTrips />} />
      <Route path="/user/settings" element={<UserSettings />} />
      <Route path="/hotels" element={<HotelsIndex />} />
      <Route path="/hotels/:id" element={<HotelDetail />} />
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
