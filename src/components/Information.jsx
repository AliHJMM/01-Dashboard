import PropTypes from "prop-types";
import "../styles/Information.css";

const Information = ({ user, attrs }) => (
  <div className="profile-information">
    <h2>Information</h2>
    <div className="info-grid">
      <div className="info-card">
        <p className="info-label">Username:</p>
        <p className="info-value">{user?.login || "N/A"}</p>
      </div>
      <div className="info-card">
        <p className="info-label">CPR:</p>
        <p className="info-value">{attrs?.CPRnumber || "N/A"}</p>
      </div>
      <div className="info-card">
        <p className="info-label">Email:</p>
        <p className="info-value">{user?.email || "N/A"}</p>
      </div>
      <div className="info-card">
        <p className="info-label">Country:</p>
        <p className="info-value">{attrs?.country || "N/A"}</p>
      </div>
      <div className="info-card">
        <p className="info-label">Degree:</p>
        <p className="info-value">{attrs?.Degree || "N/A"}</p>
      </div>
      <div className="info-card">
        <p className="info-label">Gender:</p>
        <p className="info-value">{attrs?.genders || "N/A"}</p>
      </div>
    </div>
  </div>
);

// Prop Validation
Information.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string.isRequired, // Username of the user
    email: PropTypes.string.isRequired, // Email address of the user
  }).isRequired,
  attrs: PropTypes.shape({
    CPRnumber: PropTypes.string, // Optional CPR number
    country: PropTypes.string, // Country name
    Degree: PropTypes.string, // Degree information
    genders: PropTypes.string, // Gender
  }).isRequired,
};

export default Information;
