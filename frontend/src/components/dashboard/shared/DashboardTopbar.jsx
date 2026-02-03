import  { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import ProfilePhotoModal from "./ProfilePhotoModal";

const DashboardTopbar = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const user = state?.user;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhotoUpdate = (photoUrl) => {
    // Update user context with new photo
    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...user,
        photo: photoUrl,
      },
    });
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center z-10 relative">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/images/logo.png"
          alt="Chasing Horizons Logo"
          className="h-10 w-10"
        />
        <h1 className="text-xl font-semibold text-black">
          Chasing Horizons
        </h1>
      </div>

      {/* Right side: User Profile or Username */}
      <div className="flex items-center gap-3">
        {user?.photo ? (
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#003366] transition-colors">
              <img
                src={user.photo}
                alt={user.fullName || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800">
                {user.fullName || "User"}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003366] to-[#0055aa] flex items-center justify-center text-white font-bold text-sm border-2 border-gray-200 hover:border-blue-600 transition-colors">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800">
                {user?.fullName || "User"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Photo Modal */}
      <ProfilePhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPhoto={user?.photo}
        userName={user?.fullName}
        onPhotoUpdate={handlePhotoUpdate}
      />
    </header>
  );
};

export default DashboardTopbar;
