import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../styles/XPProgress.css";

const XPProgress = ({ xpDataToUse, level, totalXp, toKilobytes }) => (
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
          tickFormatter={(value) =>
            value < 1000 ? value + " B" : Math.floor(value / 1000) + " kB"
          }
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#2e2e40",
            borderRadius: "8px",
            border: "1px solid #9b59b6",
            color: "#dcdde1",
          }}
          itemStyle={{ color: "#dcdde1" }}
          labelStyle={{ color: "#ffffff" }}
        />
        <Line type="monotone" dataKey="xp" stroke="#29d5a4" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Prop Validation
XPProgress.propTypes = {
  xpDataToUse: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired, // Date of the XP entry (formatted string)
      xp: PropTypes.number.isRequired, // XP amount
    })
  ).isRequired,
  level: PropTypes.oneOfType([
    PropTypes.number, // Numeric level value
    PropTypes.string, // Fallback 'N/A' or similar
  ]).isRequired,
  totalXp: PropTypes.number.isRequired, // Total XP as a number
  toKilobytes: PropTypes.func.isRequired, // Function to convert XP to readable format
};

export default XPProgress;
