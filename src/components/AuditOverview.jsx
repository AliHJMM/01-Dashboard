import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../styles/AuditOverview.css";

const AuditOverview = ({
  auditData,
  auditRatioValue,
  auditRatioColor,
  auditRatioMessage,
}) => (
  <div className="audit-overview-container">
    <h2 className="audit-overview-title">Audit Overview</h2>
    <div className="audit-ratio-container">
      <div className="audit-ratio-header">
        Audit Ratio:
        <span className="audit-ratio-value" style={{ color: auditRatioColor }}>
          {auditRatioValue.toFixed(2)}{" "}
          {/* Keep two decimal places for the ratio */}
        </span>
      </div>
      <p className="audit-message">{auditRatioMessage}</p>
    </div>
    <ResponsiveContainer width="100%" height={300} className="audit-bar-chart">
      <BarChart
        data={auditData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#c7c7c7" />
        <YAxis
          stroke="#c7c7c7"
          tickFormatter={(value) => {
            const kbValue = Math.floor(value / 1000); // Convert to kB and round down
            return `${kbValue} kB`;
          }}
        />
        <Tooltip
          formatter={(value) => {
            const kbValue = Math.floor(value / 1000); // Convert to kB and round down
            return `${kbValue} kB`;
          }}
          contentStyle={{
            backgroundColor: "#2e2e40",
            borderRadius: "8px",
            border: "1px solid #9b59b6",
            color: "#dcdde1",
          }}
          itemStyle={{ color: "#dcdde1" }}
          labelStyle={{ color: "#ffffff" }}
        />
        <Bar dataKey="value" fill="#9b59b6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Prop Validation
AuditOverview.propTypes = {
  auditData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  auditRatioValue: PropTypes.number.isRequired,
  auditRatioColor: PropTypes.string.isRequired,
  auditRatioMessage: PropTypes.string.isRequired,
};

export default AuditOverview;
