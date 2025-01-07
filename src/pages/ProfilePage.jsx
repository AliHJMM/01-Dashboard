import { gql, useQuery } from "@apollo/client";
import "../styles/ProfilePage.css";

// Query for user info
const GET_USER_INFO = gql`
  query {
    user {
      id
      login
      email
      attrs
    }
  }
`;

// Query for transactions (projects and exercises only)
const GET_TRANSACTIONS = gql`
  query {
    transaction(
      where: {
        type: { _eq: "xp" }
        _or: [
          { object: { type: { _eq: "project" } } }
          {
            object: { type: { _eq: "exercise" } }
            event: { path: { _eq: "/bahrain/bh-module" } }
          }
        ]
      }
      order_by: { createdAt: desc }
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

// Query for Total XP (specific to Bahrain Module)
const GET_TOTAL_XP = gql`
  query {
    transaction_aggregate(
      where: {
        event: { path: { _eq: "/bahrain/bh-module" } }
        type: { _eq: "xp" }
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`;

// Query for audits (pass and fail)
const GET_AUDITS = gql`
  query {
    user {
      validAudits: audits_aggregate(
        where: { grade: { _gte: 1 } }
        order_by: { createdAt: desc }
      ) {
        nodes {
          group {
            captainLogin
            createdAt
          }
        }
      }
      failedAudits: audits_aggregate(
        where: { grade: { _lt: 1 } }
        order_by: { createdAt: desc }
      ) {
        nodes {
          group {
            captainLogin
            createdAt
          }
        }
      }
    }
  }
`;

function ProfilePage() {
  // Queries
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

  const {
    loading: totalXpLoading,
    error: totalXpError,
    data: totalXpData,
  } = useQuery(GET_TOTAL_XP);

  const {
    loading: auditsLoading,
    error: auditsError,
    data: auditsData,
  } = useQuery(GET_AUDITS);

  if (userLoading || transactionsLoading || totalXpLoading || auditsLoading)
    return <p className="loading">Loading...</p>;

  if (userError || transactionsError || totalXpError || auditsError)
    return (
      <p className="error-message">
        Error:{" "}
        {userError?.message ||
          transactionsError?.message ||
          totalXpError?.message ||
          auditsError?.message}
      </p>
    );

  const user = userData?.user?.[0];
  const attrs = user?.attrs || {};
  const transactions = transactionsData?.transaction || [];
  const totalXp =
    totalXpData?.transaction_aggregate?.aggregate?.sum?.amount || 0;

  const validAudits = auditsData?.user?.[0]?.validAudits?.nodes || [];
  const failedAudits = auditsData?.user?.[0]?.failedAudits?.nodes || [];

  return (
    <div className="profile-container">
      {/* Welcome Section */}
      <div className="profile-welcome">
        <h1>
          Welcome, {attrs.firstName || "User"} {attrs.lastName || ""}
        </h1>
      </div>

      {/* User Information Section */}
      <div className="profile-card">
        <h2>Your Profile</h2>
        {user ? (
          <div className="user-info">
            <p>
              <strong>Login:</strong> {user.login}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Degree:</strong> {attrs.Degree || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {attrs.country || "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {attrs.genders || "N/A"}
            </p>
            <p>
              <strong>Job Title:</strong> {attrs.jobtitle || "N/A"}
            </p>
          </div>
        ) : (
          <p>No user information available.</p>
        )}
      </div>

      {/* Total XP and Transactions Section */}
      <div className="profile-card">
        <h2>Total XP and Transactions</h2>
        <p>
          <strong>Total XP (Main Program):</strong> {totalXp}
        </p>
        <div className="transactions-list">
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <p>
                  <strong>Type:</strong> {transaction.object.type}
                </p>
                <p>
                  <strong>Name:</strong> {transaction.object.name}
                </p>
                <p>
                  <strong>XP Amount:</strong> {transaction.amount}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </div>

      {/* Audits Section */}
      <div className="profile-card audits-section">
        <h2>Audits</h2>
        <div className="audits-container">
          <div className="audit-column">
            <h3>Passed Audits</h3>
            <div className="audit-list">
              {validAudits.map((audit, index) => (
                <div key={index} className="audit-item">
                  <p>
                    <strong>Captain:</strong> {audit.group.captainLogin}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(audit.group.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="audit-column">
            <h3>Failed Audits</h3>
            <div className="audit-list">
              {failedAudits.map((audit, index) => (
                <div key={index} className="audit-item">
                  <p>
                    <strong>Captain:</strong> {audit.group.captainLogin}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(audit.group.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
