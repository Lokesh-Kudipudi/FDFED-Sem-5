import { Routes, Route } from "react-router-dom";

// Import all your page components
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Recommendation from "./pages/Recommendation";
import CustomizeTour from "./pages/CustomizeTour";

// Auth pages
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import SignUpHotelManager from "./pages/auth/SignUpHotelManager";
import SignUpTourGuide from "./pages/auth/SignUpTourGuide";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminHotelManagement from "./pages/admin/AdminHotelManagement";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminQueries from "./pages/admin/AdminQueries";
import AdminTourGuides from "./pages/admin/AdminTourGuides";
import AdminHotelManagers from "./pages/admin/AdminHotelManagers";
import AdminReports from "./pages/admin/AdminReports";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminVerifications from "./pages/admin/AdminVerifications";

// Hotel Manager pages
import HotelManagerDashboard from "./pages/hotelManager/HotelManagerDashboard";
import HotelManagerMyHotel from "./pages/hotelManager/HotelManagerMyHotel";
import HotelManagerRoomsIndex from "./pages/hotelManager/HotelManagerRooms";
import HotelManagementBookings from "./pages/hotelManager/HotelManagerBookings";
import HotelManagerWelcome from "./pages/hotelManager/HotelManagerWelcome";

// Tour Guide pages
import TourGuideDashboard from "./pages/tourGuide/TourGuideDashboard";
import TourGuideMyTours from "./pages/tourGuide/TourGuideMyTours";
import TourGuideCreateTour from "./pages/tourGuide/TourGuideCreateTour";
import TourGuideBookings from "./pages/tourGuide/TourGuideBookings";

// Hotel pages
import HotelsSearch from "./pages/hotels/HotelsSearch";
import HotelDetail from "./pages/hotels/HotelDetail";
import HotelIndex from "./pages/hotels/HotelIndex";

// Tour pages
import ToursIndex from "./pages/tours/ToursIndex";
import TourDetail from "./pages/tours/TourDetail";
import ToursSearch from "./pages/tours/ToursSearch";

// User pages
import UserDashboard from "./pages/user/UserDashboard";
import MyCustomRequests from "./pages/user/MyCustomRequests";

// OWNER DASHBOARD - NEW
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeHotels from "./pages/employee/EmployeeHotels";
import EmployeeTours from "./pages/employee/EmployeeTours";
import EmployeeBookings from "./pages/employee/EmployeeBookings";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/recommendation" element={<Recommendation />} />
      <Route path="/customize-tour" element={<CustomizeTour />} />
      <Route path="/my-custom-requests" element={<MyCustomRequests />} />

      {/* Auth Routes */}
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/signup-hotel-manager" element={<SignUpHotelManager />} />
      <Route path="/auth/signup-tour-guide" element={<SignUpTourGuide />} />

      {/* Hotel Routes */}
      <Route path="/hotels" element={<HotelIndex />} />
      <Route path="/hotels/search" element={<HotelsSearch />} />
      <Route path="/hotels/hotel/:id" element={<HotelDetail />} />

      {/* Tour Routes */}
      <Route path="/tours" element={<ToursIndex />} />
      <Route path="/tours/search" element={<ToursSearch />} />
      <Route path="/tours/:id" element={<TourDetail />} />

      {/* OWNER DASHBOARD - Put this before other dashboards */}
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />

      {/* User Dashboard */}
      <Route path="/user/dashboard" element={<UserDashboard />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/admin/hotel-management" element={<AdminHotelManagement />} />
      <Route path="/admin/packages" element={<AdminPackages />} />
      <Route path="/admin/queries" element={<AdminQueries />} />
      <Route path="/admin/tour-guides" element={<AdminTourGuides />} />
      <Route path="/admin/hotel-managers" element={<AdminHotelManagers />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/employees" element={<AdminEmployees />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/verifications" element={<AdminVerifications />} />

      {/* Hotel Manager Routes */}
      <Route path="/hotel-manager/dashboard" element={<HotelManagerDashboard />} />
      <Route path="/hotel-manager/welcome" element={<HotelManagerWelcome />} />
      <Route path="/hotel-manager/room-inventory" element={<HotelManagerRoomsIndex />} />
      <Route path="/hotel-manager/my-hotel" element={<HotelManagerMyHotel />} />
      <Route path="/hotel-manager/my-hotels" element={<HotelManagerMyHotel />} />
      <Route path="/hotel-manager/bookings" element={<HotelManagementBookings />} />

      {/* Tour Guide Routes */}
      <Route path="/tour-guide/dashboard" element={<TourGuideDashboard />} />
      <Route path="/tour-guide/my-tours" element={<TourGuideMyTours />} />
      <Route path="/tour-guide/create-tour" element={<TourGuideCreateTour />} />
      <Route path="/tour-guide/edit-tour/:id" element={<TourGuideCreateTour />} />
      <Route path="/tour-guide/bookings" element={<TourGuideBookings />} />

      {/* Employee Routes */}
      <Route element={<RoleProtectedRoute allowedRoles={["employee"]} />}>
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/hotels" element={<EmployeeHotels />} />
        <Route path="/employee/tours" element={<EmployeeTours />} />
        <Route path="/employee/bookings" element={<EmployeeBookings />} />
      </Route>
    </Routes>
  );
}

export default App;
