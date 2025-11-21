import { useEffect } from "react";
import { createContext, useReducer } from "react";

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
          "http://localhost:5500/autologin",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        if (response.status === 200 && data.user) {
          dispatch({ type: "LOGIN", payload: data.user });
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
