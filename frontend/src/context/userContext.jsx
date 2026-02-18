import { useEffect } from "react";
import { createContext, useReducer } from "react";
import { API } from "../config/api";
import toast from "react-hot-toast";

const UserContext = createContext();

const initialState = { user: null };

function userReducer(state, action) {
  switch (action.type) {
    case "REGISTER":
      return { ...state, user: action.payload };
    case "LOGIN":
      return { ...state, user: action.payload };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(
    userReducer,
    initialState
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          API.AUTH.ME,
          {
            method: "GET",
            credentials: "include",
          }
        );
        

        const data = await response.json();
        if (response.status === 200 && data.user) {
          dispatch({ type: "LOGIN", payload: data.user });
          
        }else {
          toast.error(data.message || "Failed to fetch user"); 
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };