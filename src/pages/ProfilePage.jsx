// src/pages/ProfilePage.jsx
import React from "react";
import { gql, useQuery } from "@apollo/client";

// Define the GraphQL query
const GET_USER_INFO = gql`
  query {
    user {
      id
      login
    }
  }
`;

function ProfilePage() {
  // Execute the query
  const { loading, error, data } = useQuery(GET_USER_INFO);

  if (loading) return <p>Loading...</p>; // Show loading message
  if (error) return <p>Error: {error.message}</p>; // Show error message

  // Safely access the data and display it
  const user = data?.user?.[0] || {}; // Assuming `user` is an array of objects

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Profile</h1>
      <p>User ID: {user.id || "No ID available"}</p>
      <p>Username: {user.login || "No Username available"}</p>
    </div>
  );
}

export default ProfilePage;
