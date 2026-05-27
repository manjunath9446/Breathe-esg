import React from "react";

import {
  FaLeaf,
  FaBolt,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Insights() {

  const insights = [

    {
      icon: <FaExclamationTriangle />,
      title: "High Emissions Alert",
      description:
        "Scope 1 emissions are exceeding monthly sustainability targets.",
      color: "#ef4444",
    },

    {
      icon: <FaLeaf />,
      title: "Sustainability Improvement",
      description:
        "Switching to renewable energy can reduce emissions by 22%.",
      color: "#10b981",
    },

    {
      icon: <FaBolt />,
      title: "Energy Optimization",
      description:
        "Peak electricity consumption detected during business hours.",
      color: "#f59e0b",
    },

    {
      icon: <FaChartLine />,
      title: "AI Prediction",
      description:
        "Projected emissions expected to increase by 8% next quarter.",
      color: "#3b82f6",
    },
  ];

  return (

    <div>

      <h1 style={styles.heading}>
        AI Sustainability Insights
      </h1>

      <p style={styles.subheading}>
        AI-powered ESG recommendations and risk analysis
      </p>

      <div style={styles.grid}>

        {insights.map((item, index) => (

          <div
            key={index}
            style={{
              ...styles.card,
              borderTop:
                `5px solid ${item.color}`,
            }}
          >

            <div
              style={{
                ...styles.icon,
                color: item.color,
              }}
            >
              {item.icon}
            </div>

            <h3 style={styles.title}>
              {item.title}
            </h3>

            <p style={styles.description}>
              {item.description}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

const styles = {

  heading: {
    fontSize: "52px",
    fontWeight: "800",
    marginBottom: "10px",
    color: "#0f172a",
  },

  subheading: {
    color: "#64748b",
    marginBottom: "40px",
    fontSize: "18px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(300px,1fr))",
    gap: "30px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "24px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "40px",
    marginBottom: "20px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  description: {
    color: "#475569",
    lineHeight: "28px",
    fontSize: "16px",
  },
};