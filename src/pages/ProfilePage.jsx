import { useQuery } from "@apollo/client";
import "../styles/ProfilePage.css";

import {
  FETCH_USER_INFO,
  FETCH_TRANSACTIONS,
  FETCH_TOTAL_XP,
  FETCH_USER_AUDITS,
  FETCH_AUDIT_STATS,
  FETCH_TECHNICAL_SKILLS,
  FETCH_USER_LEVEL,
} from "../queries/queries";

import Header from "../components/Header";
import Information from "../components/Information";
import Audits from "../components/Audits";
import Projects from "../components/Projects";
import XPProgress from "../components/XPProgress";
import AuditOverview from "../components/AuditOverview";
import TechnicalSkills from "../components/TechnicalSkills";

const toKilobytes = (value) =>
  value < 1000 ? value + " B" : Math.floor(value / 1000) + " kB";

// Helper function: Processes radar chart data by removing prefixes
const processRadarData = (data) =>
  data.map((skill) => ({
    ...skill,
    subject: skill.subject.replace("skill_", ""),
  }));

// Helper function: Determines audit ratio display properties
const getAuditRatioDisplay = (ratio) => {
  if (ratio >= 1.5) return { color: "green", message: "Awesome, buddy!" };
  if (ratio >= 1) return { color: "yellow", message: "Keep it up, buddy!" };
  return { color: "red", message: "Careful buddy!" };
};

function ProfilePage() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

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

  const loadingStates = [
    userLoading,
    transactionsLoading,
    totalXpLoading,
    auditsLoading,
    statsLoading,
    skillsLoading,
    levelLoading,
  ];
  const errorStates = [
    userError,
    transactionsError,
    totalXpError,
    auditsError,
    statsError,
    skillsError,
    levelError,
  ];

  if (loadingStates.some(Boolean)) return <p className="loading">Loading...</p>;
  if (errorStates.some(Boolean)) {
    const errorMessage =
      errorStates.find((error) => error)?.message || "Unknown error";
    return <p className="error-message">Error: {errorMessage}</p>;
  }

  const user = userData?.user?.[0];
  const attrs = user?.attrs || {};
  const level = levelData?.transaction?.[0]?.amount || "N/A";

  const transactions = transactionsData?.transaction || [];
  const totalXp =
    totalXpData?.transaction_aggregate?.aggregate?.sum?.amount || 0;
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

  const validAudits = auditsData?.user?.[0]?.validAudits?.nodes || [];
  const failedAudits = auditsData?.user?.[0]?.failedAudits?.nodes || [];
  const auditRatio = statsData?.user?.[0]?.auditRatio || 0;
  const totalUp = statsData?.user?.[0]?.totalUp || 0;
  const totalDown = statsData?.user?.[0]?.totalDown || 0;
  const auditData = [
    { name: "Done", value: totalUp },
    { name: "Received", value: totalDown },
  ];

  const radarData = skillsData?.transaction.map((s) => ({
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
