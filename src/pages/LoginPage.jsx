import { useState } from "react";
import axios from "axios";
import "../styles/LoginPage.css";

function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const credentials = btoa(`${usernameOrEmail}:${password}`);
      const response = await axios.post(
        "https://learn.reboot01.com/api/auth/signin",
        {},
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );

      const token = response.data;
      if (!token || token.split(".").length !== 3) {
        throw new Error(`Invalid token format received.`);
      }

      localStorage.setItem("token", token);
      window.location.href = "/profile";
    } catch (err) {
      let message = "An unexpected error occurred. Please try again.";
      if (err.response?.status === 401) {
        message = "Invalid credentials. Please try again.";
      }
      setError(message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="brand-title">Welcome to 01!</h1>
        <p className="tagline">Step into the future of learning.</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email or Username</label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
