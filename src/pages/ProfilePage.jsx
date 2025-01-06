// src/pages/ProfilePage.jsx
import "../styles/ProfilePage.css";

function ProfilePage() {
  const user = {
    id: "3997",
    username: "alihasan6",
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Your Profile</h2>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
