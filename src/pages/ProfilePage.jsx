import "../styles/ProfilePage.css";
import { useProfileQueries } from "../hooks/useProfileQueries";
import {
  toKilobytes,
  processRadarData,
  getAuditRatioDisplay,
} from "../utils/helpers";

import Header from "../components/Header";
import Information from "../components/Information";
import Audits from "../components/Audits";
import Projects from "../components/Projects";
import XPProgress from "../components/XPProgress";
import AuditOverview from "../components/AuditOverview";
import TechnicalSkills from "../components/TechnicalSkills";

// Main ProfilePage component
function ProfilePage() {
  // Handles logout functionality
  const handleLogout = () => {
    // Clear the token from localStorage and redirect to login page
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  // Use custom hook to fetch profile-related queries
  const {
    userQuery,
    transactionsQuery,
    totalXpQuery,
    auditsQuery,
    statsQuery,
    skillsQuery,
    levelQuery,
    loadingStates,
    errorStates,
  } = useProfileQueries();

  // Display loading state if any query is still loading
  if (loadingStates.some(Boolean)) return <p className="loading">Loading...</p>;
  // Display error message if any query fails
  if (errorStates.some(Boolean)) {
    const errorMessage =
      errorStates.find((error) => error)?.message || "Unknown error";
    return <p className="error-message">Error: {errorMessage}</p>;
  }

  // Extract user details
  const user = userQuery.data?.user?.[0];
  const attrs = user?.attrs || {};
  const level = levelQuery.data?.transaction?.[0]?.amount || "N/A";

  // Extract and process transaction data
  const transactions = transactionsQuery.data?.transaction || [];
  const totalXp =
    totalXpQuery.data?.transaction_aggregate?.aggregate?.sum?.amount || 0;
  const xpData = transactions.map((t) => ({
    date: new Date(t.createdAt).toLocaleDateString(),
    xp: t.amount,
  }));
  const xpDataToUse = xpData.length
    ? xpData
    : [
        { date: "2023-01-01", xp: 100 },
        { date: "2023-02-01", xp: 200 },
      ];

  // Extract and process audit data
  const validAudits = auditsQuery.data?.user?.[0]?.validAudits?.nodes || [];
  const failedAudits = auditsQuery.data?.user?.[0]?.failedAudits?.nodes || [];
  const auditRatio = statsQuery.data?.user?.[0]?.auditRatio || 0;
  const totalUp = statsQuery.data?.user?.[0]?.totalUp || 0;
  const totalDown = statsQuery.data?.user?.[0]?.totalDown || 0;
  const auditData = [
    { name: "Done", value: totalUp },
    { name: "Received", value: totalDown },
  ];

  // Extract and process radar chart data
  const radarData = skillsQuery.data?.transaction.map((s) => ({
    subject: s.type,
    value: s.amount,
    fullMark: 100,
  }));
  const radarDataToUse = radarData.length
    ? processRadarData(radarData)
    : processRadarData([
        { subject: "JavaScript", value: 80, fullMark: 100 },
        { subject: "React", value: 90, fullMark: 100 },
      ]);

  // Get dynamic color and message for audit ratio display
  const { color: auditRatioColor, message: auditRatioMessage } =
    getAuditRatioDisplay(auditRatio);

  return (
    <div className="profile-container">
      <Header
        firstName={attrs.firstName}
        lastName={attrs.lastName}
        onLogout={handleLogout}
      />
      <Information user={user} attrs={attrs} />
      <Audits validAudits={validAudits} failedAudits={failedAudits} />
      <Projects transactions={transactions} toKilobytes={toKilobytes} />
      <XPProgress
        xpDataToUse={xpDataToUse}
        level={level}
        totalXp={totalXp}
        toKilobytes={toKilobytes}
      />
      <AuditOverview
        auditData={auditData}
        auditRatioValue={auditRatio}
        auditRatioColor={auditRatioColor}
        auditRatioMessage={auditRatioMessage}
      />
      <TechnicalSkills radarDataToUse={radarDataToUse} />
    </div>
  );
}

export default ProfilePage;
