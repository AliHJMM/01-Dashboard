import { gql, useQuery } from "@apollo/client";
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

// Queries
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

const GET_AUDIT_STATS = gql`
  query {
    user {
      auditRatio
      totalUp
      totalDown
    }
  }
`;

const GET_TECHNICAL_SKILLS = gql`
  query {
    transaction(
      where: {
        _and: [
          { type: { _ilike: "%skill%" } }
          { object: { type: { _eq: "project" } } }
        ]
      }
      order_by: [{ type: asc }, { createdAt: desc }]
      distinct_on: type
    ) {
      amount
      type
    }
  }
`;

const GET_TOP_TRANSACTION = gql`
  query {
    transaction(
      order_by: { amount: desc }
      limit: 1
      where: { type: { _eq: "level" }, path: { _like: "/bahrain/bh-module%" } }
    ) {
      amount
    }
  }
`;

function ProfilePage() {
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
  const {
    loading: statsLoading,
    error: statsError,
    data: statsData,
  } = useQuery(GET_AUDIT_STATS);
  const {
    loading: skillsLoading,
    error: skillsError,
    data: skillsData,
  } = useQuery(GET_TECHNICAL_SKILLS);

  const {
    loading: levelLoading,
    error: levelError,
    data: levelData,
  } = useQuery(GET_TOP_TRANSACTION);

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
    { name: "Up", value: totalUp },
    { name: "Down", value: totalDown },
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
  const radarDataToUse = radarData.length ? radarData : fallbackRadarData;

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
        <h1 className="profile-name">{`${attrs.firstName || "User"} ${
          attrs.lastName || ""
        }`}</h1>
        <p className="profile-username">
          <strong>Username:</strong> {user?.login || "N/A"}
        </p>
      </div>

      {/* Information Section */}
      <div className="profile-information">
        <h2>Information</h2>
        <div className="info-grid">
          <div className="row">
            <p>
              <strong>Email:</strong> {user?.email || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {attrs.country || "N/A"}
            </p>
          </div>
          <div className="row">
            <p>
              <strong>Degree:</strong> {attrs.Degree || "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {attrs.genders || "N/A"}
            </p>
          </div>
          <div className="row">
            <p>
              <strong>Job Title:</strong> {attrs.jobtitle || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* XP Progress Section */}
      <div className="xp-chart-container">
        <h2 className="xp-chart-title">XP Progress</h2>
        <div className="xp-stats">
          <span className="user-level">Level {level}</span>{" "}
          {/* Replace with calculated level */}
          <span className="user-xp">{totalXp} XP</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={xpDataToUse}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#c7c7c7" />
            <YAxis stroke="#c7c7c7" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { date, xp, type, name } = payload[0].payload; // Extract additional data
                  return (
                    <div
                      className="custom-tooltip"
                      style={{
                        backgroundColor: "#2a2a3e",
                        padding: "10px",
                        color: "#fff",
                      }}
                    >
                      <p>
                        <strong>Date:</strong> {date}
                      </p>
                      <p>
                        <strong>XP:</strong> {xp}
                      </p>
                      <p>
                        <strong>Type:</strong> {type}
                      </p>
                      <p>
                        <strong>Name:</strong> {name}
                      </p>
                    </div>
                  );
                }
                return null;
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

      {/* Total XP and Transactions Section */}
      <div className="transactions-container">
        <h2 className="transactions-title">Projects</h2>
        <div className="transactions-list">
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-details">
                  <h3 className="transaction-name">
                    {transaction.object.name}
                  </h3>
                  <p className="transaction-type">
                    <strong>Type:</strong> {transaction.object.type}
                  </p>
                </div>
                <div className="transaction-xp">
                  <span className="xp-value">+{transaction.amount} XP</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-transactions">No transactions found.</p>
          )}
        </div>
      </div>

      <div className="profile-card audit-status-container">
        <h2>Audits</h2>
        <div className="audit-status-list">
          {validAudits.map((audit, index) => (
            <div key={`valid-${index}`} className="audit-status-item">
              <span className="audit-icon success">✔️</span>
              <div className="audit-info">
                <p className="audit-title">
                  <strong>Captain:</strong> {audit.group.captainLogin}
                </p>
                <p className="audit-date">
                  <strong>Date:</strong>{" "}
                  {new Date(audit.group.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {failedAudits.map((audit, index) => (
            <div key={`failed-${index}`} className="audit-status-item">
              <span className="audit-icon fail">❌</span>
              <div className="audit-info">
                <p className="audit-title">
                  <strong>Captain:</strong> {audit.group.captainLogin}
                </p>
                <p className="audit-date">
                  <strong>Date:</strong>{" "}
                  {new Date(audit.group.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Combined Audit Overview */}
        <div className="audit-overview-container">
          <h2 className="audit-overview-title">Audit Overview</h2>

          {/* Audit Ratio */}
          <div className="audit-ratio-container">
            <p className="audit-ratio">
              <strong>Audit Ratio:</strong>{" "}
              <span style={{ color: auditRatioColor }}>
                {auditRatioValue.toFixed(2)}
              </span>
            </p>
            <p className="audit-message">{auditRatioMessage}</p>
          </div>

          {/* Audit Bar Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={auditData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e40" />
              <XAxis dataKey="name" stroke="#c7c7c7" />
              <YAxis stroke="#c7c7c7" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { name, value } = payload[0].payload;
                    return (
                      <div
                        style={{
                          backgroundColor: "#1a1a2e",
                          padding: "10px",
                          border: "1px solid #9b59b6",
                          color: "#ffffff",
                        }}
                      >
                        <p>
                          <strong>{name}:</strong> {value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ fill: "rgba(155, 89, 182, 0.2)" }}
              />
              <Bar dataKey="value" fill="#9b59b6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="radar-chart-container">
        <h2 className="radar-chart-title">Technical Skills</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarDataToUse}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" stroke="#c7c7c7" />
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
