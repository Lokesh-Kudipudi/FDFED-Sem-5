import PropTypes from "prop-types";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { state } = useContext(UserContext);

  if (!state.user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (!allowedRoles.includes(state.user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

RoleProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleProtectedRoute;
