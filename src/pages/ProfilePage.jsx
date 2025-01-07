// src/pages/ProfilePage.jsx
import { gql, useQuery } from "@apollo/client";
import "../styles/ProfilePage.css";

// Query for user info
const GET_USER_INFO = gql`
  query {
    user {
      id
      login
    }
  }
`;

// Query for transaction history
const GET_TRANSACTIONS = gql`
  query {
    transaction(
      where: { type: { _eq: "xp" }, object: { type: { _eq: "project" } } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      object {
        name
        type
      }
    }
  }
`;

function ProfilePage() {
  // Execute both queries
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_USER_INFO);
  const {
    loading: transactionsLoading,
    error: transactionsError,
    data: transactionsData,
  } = useQuery(GET_TRANSACTIONS);

  if (userLoading || transactionsLoading)
    return <p className="loading">Loading...</p>;
  if (userError)
    return <p className="error-message">Error: {userError.message}</p>;
  if (transactionsError)
    return <p className="error-message">Error: {transactionsError.message}</p>;

  const user = userData?.user?.[0];
  const transactions = transactionsData?.transaction || [];

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Your Profile</h2>
        {user ? (
          <div className="user-info">
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Username:</strong> {user.login}
            </p>
          </div>
        ) : (
          <p>No user information available.</p>
        )}
      </div>

      <div className="profile-card">
        <h2>Transaction History</h2>
        {transactions.length > 0 ? (
          <div className="transaction-list">
            {transactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <p>
                  <strong>Project:</strong> {transaction.object.name} (
                  {transaction.object.type})
                </p>
                <p>
                  <strong>XP Amount:</strong> {transaction.amount}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
