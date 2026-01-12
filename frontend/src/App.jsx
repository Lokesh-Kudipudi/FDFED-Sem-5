import { Routes, Route, Navigate } from "react-router-dom";

// Import all your page components here
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignUpHotelManager from "./pages/SignUpHotelManager";
import SignUpTourGuide from "./pages/SignUpTourGuide";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminHotelManagement from "./pages/AdminHotelManagement";
import AdminPackages from "./pages/AdminPackages";
import AdminQueries from "./pages/AdminQueries";
import AdminTourGuides from "./pages/AdminTourGuides";
import AdminHotelManagers from "./pages/AdminHotelManagers";
import AdminBookings from "./pages/AdminBookings";

import HotelManagerDashboard from "./pages/HotelManagerDashboard";
import HotelManagerMyHotel from "./pages/HotelManagerMyHotel";
import HotelManagerRoomsIndex from "./pages/HotelManagerRooms";
import HotelManagementBookings from "./pages/HotelManagerBookings";
import HotelManagerWelcome from "./pages/HotelManagerWelcome";

import TourGuideDashboard from "./pages/TourGuideDashboard";
import TourGuideMyTours from "./pages/TourGuideMyTours";
import TourGuideCreateTour from "./pages/TourGuideCreateTour";
import TourGuideBookings from "./pages/TourGuideBookings";

import UserDashboard from "./pages/UserDashboard";
import HotelsSearch from "./pages/HotelsSearch";
import HotelDetail from "./pages/HotelDetail";
import HotelIndex from "./pages/HotelIndex";
import ToursIndex from "./pages/ToursIndex";
import TourDetail from "./pages/TourDetail";
import Recommendation from "./pages/Recommendation";
import ToursSearch from "./pages/ToursSearch";
import CustomizeTour from "./pages/CustomizeTour";
import MyCustomRequests from "./pages/MyCustomRequests";

import ChangePassword from "./pages/ChangePassword";

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
        path="/auth/signup-tour-guide"
        element={<SignUpTourGuide />}
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
        path="/admin/queries"
        element={<AdminQueries />}
      />
      <Route
        path="/admin/tour-guides"
        element={<AdminTourGuides />}
      />
      <Route
        path="/admin/hotel-managers"
        element={<AdminHotelManagers />}
      />
      <Route
        path="/admin/bookings"
        element={<AdminBookings />}
      />
      <Route
        path="/hotel-manager/dashboard"
        element={<HotelManagerDashboard />}
      />
      <Route
        path="/hotel-manager/welcome"
        element={<HotelManagerWelcome />}
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
        path="/tour-guide/dashboard"
        element={<TourGuideDashboard />}
      />
      <Route
        path="/tour-guide/my-tours"
        element={<TourGuideMyTours />}
      />
      <Route
        path="/tour-guide/create-tour"
        element={<TourGuideCreateTour />}
      />
      <Route
        path="/tour-guide/edit-tour/:id"
        element={<TourGuideCreateTour />}
      />
      <Route
        path="/tour-guide/bookings"
        element={<TourGuideBookings />}
      />
      <Route
        path="/user/dashboard"
        element={<UserDashboard />}
      />
      <Route path="/hotels" element={<Navigate to="/hotels/search" replace />} />
      <Route path="/hotels/search" element={<HotelsSearch />} />
      <Route
        path="/hotels/hotel/:id"
        element={<HotelDetail />}
      />
      <Route path="/tours" element={<ToursIndex />} />
      <Route path="/tours/search" element={<ToursSearch />} />
      <Route path="/tours/:id" element={<TourDetail />} />
      <Route path="/customize-tour" element={<CustomizeTour />} />
      <Route path="/my-custom-requests" element={<MyCustomRequests />} />
      <Route
        path="/recommendation"
        element={<Recommendation />}
      />
        <Route
          path="/change-password"
          element={<ChangePassword />}
        />
    </Routes>
  );
}

export default App;
