import PropTypes from "prop-types";
import "../styles/Header.css";

const Header = ({ firstName, lastName, onLogout }) => (
  <div className="profile-header">
    <div className="header-content">
      <h1 className="profile-name">
        Welcome, {firstName || "User"} {lastName || ""}!
      </h1>
      <button className="logout-button" onClick={onLogout}>
        <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
      </button>
    </div>
  </div>
);

// Prop Validation
Header.propTypes = {
  firstName: PropTypes.string.isRequired, // Required string for first name
  lastName: PropTypes.string, // Optional string for last name
  onLogout: PropTypes.func.isRequired, // Required function for logout
};

export default Header;
