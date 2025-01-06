// src/pages/ProfilePage.jsx
import { gql, useQuery } from "@apollo/client";
import "../styles/ProfilePage.css";

// Define the GraphQL query
const GET_USER_INFO = gql`
  query GetUserInfo {
    user {
      id
      login
    }
  }
`;

function ProfilePage() {
  // Execute the query
  const { loading, error, data } = useQuery(GET_USER_INFO);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error-message">Error: {error.message}</p>;

  // Safely access the user data
  const user = data?.user?.[0];

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>User Not Found</h2>
          <p>No user information could be retrieved. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Your Profile</h2>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Username:</strong> {user.login}
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
