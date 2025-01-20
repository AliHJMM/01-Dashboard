import PropTypes from "prop-types";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import "../styles/TechnicalSkills.css";

const TechnicalSkills = ({ radarDataToUse }) => (
  <div className="radar-chart-container">
    <h2 className="radar-chart-title">Technical Skills</h2>
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={radarDataToUse}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          stroke="#c7c7c7"
          tick={{ fontSize: 12 }}
          tickLine={false}
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
);

// Prop Validation
TechnicalSkills.propTypes = {
  radarDataToUse: PropTypes.arrayOf(
    PropTypes.shape({
      subject: PropTypes.string.isRequired, // Name of the skill
      value: PropTypes.number.isRequired, // Skill proficiency
      fullMark: PropTypes.number.isRequired, // Maximum proficiency
    })
  ).isRequired,
};

export default TechnicalSkills;
