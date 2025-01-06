// src/pages/ProfilePage.jsx
import { gql, useQuery } from "@apollo/client";

const GET_USER_INFO = gql`
  query {
    user {
      id
      login
    }
  }
`;

function ProfilePage() {
  const { loading, error, data } = useQuery(GET_USER_INFO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data?.user?.[0] || {};

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Profile</h1>
      <p>User ID: {user.id || "No ID available"}</p>
      <p>Username: {user.login || "No Username available"}</p>
    </div>
  );
}

export default ProfilePage;
