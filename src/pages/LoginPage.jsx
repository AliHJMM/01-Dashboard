// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const credentials = btoa(`${usernameOrEmail}:${password}`); // Encode credentials

      const response = await axios.post(
        import.meta.env.VITE_AUTH_API, // Use environment variable
        {}, // Empty body
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );

      const token = response.data; // Directly assign the response as the token

      // Validate token format (should have 3 parts separated by '.')
      if (!token || token.split(".").length !== 3) {
        throw new Error(`Invalid token format received.`);
      }

      localStorage.setItem("token", token); // Save the token

      window.location.href = "/profile"; // Redirect to profile page
    } catch (err) {
      let message = "An unexpected error occurred. Please try again.";
      if (err.response?.status === 401) {
        message = "Invalid credentials. Please try again.";
      } else if (err.response?.data?.error) {
        message = err.response.data.error; // Show specific error message from API
      }
      setError(message); // Display the error message to the user
    }
  };

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username or Email:</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;
