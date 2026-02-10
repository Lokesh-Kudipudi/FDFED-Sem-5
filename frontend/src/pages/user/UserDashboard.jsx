import { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import Overview from "../../components/dashboard/user/Overview";

import HotelBookings from "../../components/dashboard/user/HotelBookings";
import TourBookings from "../../components/dashboard/user/TourBookings";
import Settings from "../../components/dashboard/user/Settings";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import { API } from "../../config/api";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    photo: "", // Existing photo URL
    photoPreview: null // For UI preview
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from context into profile state
    if (state.user) {
      setProfile({
        fullName: state.user.fullName || "",
        email: state.user.email || "",
        phone: state.user.phone || "",
        address: state.user.address || "",
        photo: state.user.photo || "",
        photoPreview: null,
        createdAt: state.user.createdAt || ""
      });
    }
  }, [state.user]);

  // === SETTINGS FUNCTIONS ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photoPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {

      // Phone Validation
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(profile.phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        setIsLoading(false);
        return;
      }

      if(profile.fullName.length < 3){
        toast.error("Full name must be at least 3 characters long");
        setIsLoading(false);
        return;
      }

      if(profile.address.length < 10){
        toast.error("Address must be at least 10 characters long");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("fullName", profile.fullName);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("address", profile.address);
      
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await fetch(
        API.USERS.PROFILE,
        {
          method: "POST",
          credentials: "include", // Important for cookies
          body: formData, // FormData automatically sets multipart/form-data with boundary
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Update the user context with new data
        dispatch({ type: "UPDATE_USER", payload: data.user });
        toast.success("Profile updated successfully!");
        setPhotoFile(null); // Clear selected file
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteModal(true);
  };

  const executeDeleteAccount = async () => {
    setShowDeleteModal(false);

    setIsLoading(true);
    try {
      const response = await fetch(
        API.AUTH.DELETE_ACCOUNT,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        toast.success("Account deleted successfully!");
        
        // Clear user context
        dispatch({ type: "LOGOUT" });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "An error occurred while deleting your account");
    } finally {
      setIsLoading(false);
    }
  };


  const sidebarItems = [
    { key: "overview", label: "Overview" },
    { key: "hotel-bookings", label: "Hotel Bookings" },
    { key: "tour-bookings", label: "Tour Bookings" },
    { key: "settings", label: "Settings" },
  ];

  return (<>
  {state.user &&
    <DashboardLayout
      title="User Dashboard"
      sidebarItems={sidebarItems}
      activeItem={activeTab}
      onItemClick={setActiveTab}
      >
      {activeTab === "overview" && <Overview />}
      {activeTab === "hotel-bookings" && <HotelBookings />}
      {activeTab === "tour-bookings" && <TourBookings />}
      {activeTab === "settings" && (
        <Settings
        profile={profile}
        onInputChange={handleInputChange}
        onPhotoChange={handlePhotoChange}
        onSaveProfile={handleSaveProfile}
        onDeleteAccount={handleDeleteConfirmation}
        isLoading={isLoading}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone. All your data, bookings, and preferences will be permanently removed."
        confirmText="Delete Account"
        cancelText="Cancel"
        type="danger"
        />
    </DashboardLayout>}
    {!state.user && <Navigate to="/" />}
    </>
  );
};

export default UserDashboard;
