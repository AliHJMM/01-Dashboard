import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token || token.split(".").length !== 3) {
    // If the token is invalid or missing, redirect to the login page
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }
  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
