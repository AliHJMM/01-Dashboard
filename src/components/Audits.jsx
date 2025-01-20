import PropTypes from "prop-types";
import "../styles/Audits.css";

const Audits = ({ validAudits, failedAudits }) => (
  <div className="audit-status-container">
    <h2>Audits</h2>
    <div className="audit-status-list">
      {validAudits.map((audit, index) => (
        <div key={`valid-${index}`} className="audit-status-item">
          <div className="audit-status-header">
            <span className="audit-title">
              <strong>Captain:</strong> {audit.group.captainLogin}
            </span>
            <span className="audit-icon success">✔️</span>
          </div>
          <p className="audit-date">
            <strong>Date:</strong>{" "}
            {new Date(audit.group.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
      {failedAudits.map((audit, index) => (
        <div key={`failed-${index}`} className="audit-status-item">
          <div className="audit-status-header">
            <span className="audit-title">
              <strong>Captain:</strong> {audit.group.captainLogin}
            </span>
            <span className="audit-icon fail">❌</span>
          </div>
          <p className="audit-date">
            <strong>Date:</strong>{" "}
            {new Date(audit.group.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// Prop Validation
Audits.propTypes = {
  validAudits: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.shape({
        captainLogin: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  failedAudits: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.shape({
        captainLogin: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default Audits;
