import { useContext } from "react";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";

function useAuth() {
  const {
    state: { user },
    dispatch,
  } = useContext(UserContext);
  const navigate = useNavigate();

  const signUpHotelManager = async (userData) => {
    try {
      const response = await fetch(API.AUTH.REGISTER_HOTEL_MANAGER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          password: userData.password,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        toast.success("Hotel Manager registered successfully!");
        dispatch({ type: "REGISTER", payload: data.user });
        setTimeout(() => {
          navigate("/hotel-manager/welcome");
        }, 1000);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const signUpTourGuide = async (userData) => {
    try {
      const response = await fetch(API.AUTH.REGISTER_TOUR_GUIDE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          password: userData.password,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        toast.success(
          "Tour Guide registered successfully, Redirecting to Sign In Page."
        );
        dispatch({ type: "REGISTER", payload: data.user });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await fetch(API.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success(
          "User registered successfully, Redirecting to Sign In Page."
        );
        dispatch({ type: "REGISTER", payload: data.user });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(API.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success("User signed in successfully, Redirecting to Home Page.");
        dispatch({ type: "LOGIN", payload: data.user });
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (data.user.role === "hotelManager") {
            navigate("/hotel-manager/dashboard");
          } else if (data.user.role === "tourGuide") {
            navigate("/tour-guide/dashboard");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        console.error("Login failed:", data.message);
        toast.error(data.message || "Sign in failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "An error occurred during sign in");
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(API.AUTH.LOGOUT, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        toast.success("User logged out successfully");
        dispatch({ type: "LOGOUT" });
        navigate("/", { replace: true });
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to log out");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(err.message);
    }
  };

  const updatePassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    try {
      const response = await fetch(API.AUTH.PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success(data.message || "Password updated successfully");
        return { status: "success", message: data.message };
      } else {
        throw new Error(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error("Password update error:", err);
      toast.error(err.message);
      return { status: "fail", message: err.message };
    }
  };

  return {
    user,
    login,
    logout,
    signUp,
    signUpHotelManager,
    signUpTourGuide,
    updatePassword,
  };
}

export default useAuth;
