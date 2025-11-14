import { useContext } from "react";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function useAuth() {
  const {
    state: { user },
    dispatch,
  } = useContext(UserContext);
  const navigate = useNavigate();

  const signUpHotelManager = async (userData) => {
    try {
      const response = await fetch(
        "http://localhost:5500/signUpHotelManager",
        {
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
        }
      );

      const data = await response.json();
      if (response.status === 201) {
        toast.success(
          "Hotel Manager registered successfully, Redirecting to Sign In Page."
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
    console.log(userData);
    try {
      const response = await fetch(
        "http://localhost:5500/signup",
        {
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
        }
      );

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
      const response = await fetch(
        "http://localhost:5500/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        toast.success(
          "User signed in successfully, Redirecting to Home Page."
        );
        dispatch({ type: "LOGIN", payload: data.user });
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5500/logout",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 200) {
        toast.success("User logged out successfully");
        dispatch({ type: "LOGOUT" });
        navigate("/", { replace: true });
      } else {
        throw new Error("Failed to log out");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return { user, login, logout, signUp, signUpHotelManager };
}

export default useAuth;
