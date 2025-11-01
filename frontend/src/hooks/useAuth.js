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
          navigate("/");
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
        navigate("/");
      } else {
        throw new Error("Failed to log out");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return { user, login, logout };
}

export default useAuth;
