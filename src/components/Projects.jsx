import PropTypes from "prop-types";
import "../styles/Projects.css";

const Projects = ({ transactions, toKilobytes }) => (
  <div className="transactions-container">
    <h2 className="transactions-title">Projects</h2>
    <div className="transactions-list">
      {transactions.map((transaction, index) => (
        <div key={index} className="transaction-item">
          <div className="transaction-details">
            <h3 className="transaction-name">{transaction.object.name}</h3>
            <p className="transaction-type">
              <strong>Type:</strong> {transaction.object.type}
            </p>
          </div>
          <div className="transaction-xp">
            <span className="xp-value">+{toKilobytes(transaction.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Prop Validation
Projects.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired, // Transaction amount
      createdAt: PropTypes.string.isRequired, // Creation date
      object: PropTypes.shape({
        name: PropTypes.string.isRequired, // Name of the transaction
        type: PropTypes.string.isRequired, // Type of the transaction
      }).isRequired,
    })
  ).isRequired,
  toKilobytes: PropTypes.func.isRequired, // Function to format the amount
};

export default Projects;
