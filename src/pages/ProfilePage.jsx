import { useQuery } from "@apollo/client";
import "../styles/ProfilePage.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
} from "recharts";

import {
  FETCH_USER_INFO,
  FETCH_TRANSACTIONS,
  FETCH_TOTAL_XP,
  FETCH_USER_AUDITS,
  FETCH_AUDIT_STATS,
  FETCH_TECHNICAL_SKILLS,
  FETCH_USER_LEVEL,
} from "../queries/queries";

// Utility Function to Convert XP to Kilobytes
const toKilobytes = (value) => {
  if (value < 1000) {
    return value + " B";
  } else {
    return Math.floor(value / 1000) + " kB";
  }
};

function ProfilePage() {
  function handleLogout() {
    // Remove  token from localStorage
    localStorage.removeItem("token");

    // Optionally, redirect the user to the login page
    window.location.href = "/"; // Adjust the path based on your app's routing
  }

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(FETCH_USER_INFO);
  const {
    loading: transactionsLoading,
    error: transactionsError,
    data: transactionsData,
  } = useQuery(FETCH_TRANSACTIONS);
  const {
    loading: totalXpLoading,
    error: totalXpError,
    data: totalXpData,
  } = useQuery(FETCH_TOTAL_XP);
  const {
    loading: auditsLoading,
    error: auditsError,
    data: auditsData,
  } = useQuery(FETCH_USER_AUDITS);
  const {
    loading: statsLoading,
    error: statsError,
    data: statsData,
  } = useQuery(FETCH_AUDIT_STATS);
  const {
    loading: skillsLoading,
    error: skillsError,
    data: skillsData,
  } = useQuery(FETCH_TECHNICAL_SKILLS);
  const {
    loading: levelLoading,
    error: levelError,
    data: levelData,
  } = useQuery(FETCH_USER_LEVEL);

  if (
    userLoading ||
    transactionsLoading ||
    totalXpLoading ||
    auditsLoading ||
    statsLoading ||
    skillsLoading ||
    levelLoading
  )
    return <p className="loading">Loading...</p>;

  if (
    userError ||
    transactionsError ||
    totalXpError ||
    auditsError ||
    statsError ||
    skillsError ||
    levelError
  )
    return (
      <p className="error-message">
        Error:{" "}
        {userError?.message ||
          transactionsError?.message ||
          totalXpError?.message ||
          auditsError?.message ||
          statsError?.message ||
          skillsError?.message ||
          levelError?.message}
      </p>
    );

  // User Data
  const user = userData?.user?.[0];
  const attrs = user?.attrs || {};
  const level = levelData?.transaction?.[0]?.amount || "N/A"; // Fetch level from query

  // XP and Transactions Data
  const transactions = transactionsData?.transaction || [];
  const totalXp =
    totalXpData?.transaction_aggregate?.aggregate?.sum?.amount || 0;
  const xpData = transactions.map((transaction) => ({
    date: new Date(transaction.createdAt).toLocaleDateString(),
    xp: transaction.amount,
  }));

  // Fallback XP Data
  const fallbackXpData = [
    { date: "2023-01-01", xp: 100 },
    { date: "2023-02-01", xp: 200 },
  ];
  const xpDataToUse = xpData.length ? xpData : fallbackXpData;

  // Audits Data
  const validAudits = auditsData?.user?.[0]?.validAudits?.nodes || [];
  const failedAudits = auditsData?.user?.[0]?.failedAudits?.nodes || [];
  const auditRatio = statsData?.user?.[0]?.auditRatio || 0;
  const totalUp = statsData?.user?.[0]?.totalUp || 0;
  const totalDown = statsData?.user?.[0]?.totalDown || 0;

  // Audit Graph Data
  const auditData = [
    { name: "Done", value: totalUp },
    { name: "Received", value: totalDown },
  ];

  // Radar Chart Data
  const radarData = skillsData?.transaction.map((skill) => ({
    subject: skill.type,
    value: skill.amount,
    fullMark: 100,
  }));
  const fallbackRadarData = [
    { subject: "JavaScript", value: 80, fullMark: 100 },
    { subject: "React", value: 90, fullMark: 100 },
  ];
  // Remove "skill_" prefix from skill names
  const radarDataToUse = radarData.length
    ? radarData.map((skill) => ({
        ...skill,
        subject: skill.subject.replace("skill_", ""), // Remove "skill_"
      }))
    : fallbackRadarData.map((skill) => ({
        ...skill,
        subject: skill.subject.replace("skill_", ""), // Remove "skill_" from fallback data as well
      }));

  // Audit Ratio Display
  const auditRatioValue = parseFloat(auditRatio) || 0;
  let auditRatioColor = "red";
  let auditRatioMessage = "Careful buddy!";
  if (auditRatioValue >= 1.5) {
    auditRatioColor = "green";
    auditRatioMessage = "Awesome, buddy!";
  } else if (auditRatioValue >= 1 && auditRatioValue < 1.5) {
    auditRatioColor = "yellow";
    auditRatioMessage = "Keep it up, buddy!";
  }

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="profile-name">{`Welcome, ${
            attrs.firstName || "User"
          } ${attrs.lastName || ""}!`}</h1>
          <button className="logout-button" onClick={handleLogout}>
            <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
          </button>
        </div>
      </div>

      {/* Information Section */}
      <div className="profile-information">
        <h2>Information</h2>
        <div className="info-grid">
          <div className="info-card">
            <p className="info-label">Username:</p>
            <p className="info-value">{user?.login || "N/A"}</p>
          </div>
          <div className="info-card">
            <p className="info-label">CPR:</p>
            <p className="info-value">{attrs?.CPRnumber || "N/A"}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Email:</p>
            <p className="info-value">{user?.email || "N/A"}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Country:</p>
            <p className="info-value">{attrs?.country || "N/A"}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Degree:</p>
            <p className="info-value">{attrs?.Degree || "N/A"}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Gender:</p>
            <p className="info-value">{attrs?.genders || "N/A"}</p>
          </div>
        </div>
      </div>
      {/* Audits Section */}
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

      {/* Transactions Section */}
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
                <span className="xp-value">
                  +{toKilobytes(transaction.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Graphs Section */}
      {/* XP Progress */}
      <div className="xp-chart-container">
        <h2 className="xp-chart-title">XP Progress</h2>
        <div className="xp-header-container">
          <span className="user-level">Level {level}</span>
          <span className="user-xp">{toKilobytes(totalXp)}</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={xpDataToUse}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#c7c7c7" />
            <YAxis
              stroke="#c7c7c7"
              tickFormatter={(value) => {
                if (value < 1000) {
                  return value + " B";
                } else {
                  return Math.floor(value / 1000) + " kB";
                }
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#2e2e40", // Matches your theme background
                borderRadius: "8px",
                border: "1px solid #9b59b6", // Accent color from your theme
                color: "#dcdde1", // Text color to match your theme
              }}
              itemStyle={{
                color: "#dcdde1", // Ensures tooltip text color matches your theme
              }}
              labelStyle={{
                color: "#dcdde1", // Ensures the label text color is consistent
              }}
            />

            <Line
              type="monotone"
              dataKey="xp"
              stroke="#29d5a4"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Audit Overview */}
      <div className="audit-overview-container">
        <h2 className="audit-overview-title">Audit Overview</h2>
        <div className="audit-ratio-container">
          <div className="audit-ratio-header">
            <strong>Audit Ratio:</strong>
            <span
              className="audit-ratio-value"
              style={{ color: auditRatioColor }}
            >
              {auditRatioValue.toFixed(2)}
            </span>
          </div>
          <p className="audit-message">{auditRatioMessage}</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={auditData}
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }} // Add space to the left
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#c7c7c7" />
            <YAxis
              stroke="#c7c7c7"
              tickFormatter={(value) => {
                if (value < 1000) {
                  return value + " B";
                } else {
                  return Math.floor(value / 1000) + " kB";
                }
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#2e2e40", // Matches your theme background
                borderRadius: "8px",
                border: "1px solid #9b59b6", // Accent color from your theme
                color: "#dcdde1", // Text color to match your theme
              }}
              itemStyle={{
                color: "#dcdde1", // Ensures tooltip text color matches your theme
              }}
              labelStyle={{
                color: "#dcdde1", // Ensures the label text color is consistent
              }}
            />

            <Bar dataKey="value" fill="#9b59b6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Radar Chart */}
      <div className="radar-chart-container">
        <h2 className="radar-chart-title">Technical Skills</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart
            data={radarDataToUse}
            margin={{ top: 20, right: 50, left: 50, bottom: 20 }} // Add padding
          >
            <PolarGrid />
            <PolarAngleAxis
              dataKey="subject"
              stroke="#c7c7c7"
              tick={{ fontSize: 12 }}
              tickLine={false} // Remove extra lines if they clutter the chart
            />

            <PolarRadiusAxis stroke="#c7c7c7" />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="#ff6347"
              fill="#ff6347"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProfilePage;
