import React, { useEffect, useMemo, useState } from "react";

import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  FaLeaf,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

export default function Dashboard() {

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/emissions/"
      );

      console.log(response.data);

      if (Array.isArray(response.data)) {
        setRecords(response.data);
      }

      else if (response.data.results) {
        setRecords(response.data.results);
      }

      else {
        setRecords([]);
      }

      setLoading(false);

    } catch (err) {

      console.log(err);

      setError("Failed to load dashboard");

      setLoading(false);
    }
  };

  const analytics = useMemo(() => {

    const total = records.reduce(
      (sum, r) => sum + Number(r.co2e || 0),
      0
    );

    const approved = records.filter(
      (r) =>
        String(r.review_status).toUpperCase() ===
        "APPROVED"
    ).length;

    const pending = records.filter(
      (r) =>
        String(r.review_status).toUpperCase() !==
        "APPROVED"
    ).length;

    const scopeTotals = {
      "Scope 1": 0,
      "Scope 2": 0,
      "Scope 3": 0,
    };

    records.forEach((r) => {

      const scope = String(
        r.scope || ""
      ).toLowerCase();

      const value = Number(r.co2e || 0);

      if (scope.includes("1")) {
        scopeTotals["Scope 1"] += value;
      }

      else if (scope.includes("2")) {
        scopeTotals["Scope 2"] += value;
      }

      else if (scope.includes("3")) {
        scopeTotals["Scope 3"] += value;
      }
    });

    return {

      total,

      approved,

      pending,

      chartData: [
        {
          name: "Scope 1",
          co2e: scopeTotals["Scope 1"],
        },
        {
          name: "Scope 2",
          co2e: scopeTotals["Scope 2"],
        },
        {
          name: "Scope 3",
          co2e: scopeTotals["Scope 3"],
        },
      ],
    };

  }, [records]);

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading ESG analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        {error}
      </div>
    );
  }

  return (

    <div style={styles.page}>

      <div style={styles.header}>

        <h1 style={styles.title}>
          ESG Analytics Dashboard
        </h1>

        <p style={styles.subtitle}>
          Real-time sustainability intelligence
        </p>

      </div>

      <div style={styles.cards}>

        <div
          style={{
            ...styles.card,
            borderTop: "5px solid #10b981",
          }}
        >
          <FaLeaf size={28} />

          <h3>Total CO2e</h3>

          <h1>
            {analytics.total.toFixed(2)}
          </h1>

          <p>MT CO2 Equivalent</p>
        </div>

        <div
          style={{
            ...styles.card,
            borderTop: "5px solid #3b82f6",
          }}
        >
          <FaDatabase size={28} />

          <h3>Records</h3>

          <h1>{records.length}</h1>

          <p>Processed Entries</p>
        </div>

        <div
          style={{
            ...styles.card,
            borderTop: "5px solid #f59e0b",
          }}
        >
          <FaExclamationTriangle size={28} />

          <h3>Pending Reviews</h3>

          <h1>{analytics.pending}</h1>

          <p>Needs Attention</p>
        </div>

        <div
          style={{
            ...styles.card,
            borderTop: "5px solid #8b5cf6",
          }}
        >
          <FaCheckCircle size={28} />

          <h3>Approved</h3>

          <h1>{analytics.approved}</h1>

          <p>Verified Entries</p>
        </div>

      </div>

      <div style={styles.chartGrid}>

        <div style={styles.chartCard}>

          <h2>Emissions by Scope</h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={analytics.chartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="co2e"
                fill="#10b981"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div style={styles.chartCard}>

          <h2>Scope Distribution</h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <PieChart>

              <Pie
                data={analytics.chartData}
                dataKey="co2e"
                outerRadius={120}
                label
              >

                {analytics.chartData.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div style={styles.chartCard}>

        <h2>Emission Trend Analysis</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart
            data={analytics.chartData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="co2e"
              stroke="#10b981"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div style={styles.chartCard}>

        <h2>AI Sustainability Insights</h2>

        <div style={styles.insight}>
          ⚡ Total emissions exceed
          recommended threshold.
        </div>

        <div style={styles.insight}>
          📉 Scope 1 contributes highest
          emissions.
        </div>

        <div style={styles.insight}>
          🔍 {analytics.pending} records
          require analyst review.
        </div>

        <div style={styles.insight}>
          🌱 Consider fuel optimization
          strategies.
        </div>

      </div>

      <div style={styles.chartCard}>

        <h2>Recent Emission Records</h2>

        <table style={styles.table}>

          <thead>

            <tr>
              <th>Activity</th>
              <th>Scope</th>
              <th>CO2e</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {records
              .slice(0, 8)
              .map((record, index) => (

                <tr key={index}>

                  <td>
                    {record.activity_type ||
                      "fuel"}
                  </td>

                  <td>{record.scope}</td>

                  <td>
                    {Number(
                      record.co2e || 0
                    ).toFixed(2)}
                  </td>

                  <td>

                    <span
                      style={{
                        ...styles.badge,

                        background:
                          record.review_status ===
                          "APPROVED"
                            ? "#dcfce7"
                            : "#fee2e2",

                        color:
                          record.review_status ===
                          "APPROVED"
                            ? "#166534"
                            : "#b91c1c",
                      }}
                    >

                      {record.review_status ||
                        "FLAGGED"}

                    </span>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

const styles = {

  page: {
    padding: "30px",
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  loading: {
    padding: "50px",
    fontSize: "24px",
  },

  error: {
    padding: "50px",
    color: "red",
    fontSize: "22px",
  },

  header: {
    marginBottom: "30px",
  },

  title: {
    fontSize: "60px",
    fontWeight: "800",
    color: "#0f172a",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
    fontSize: "20px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
      "0 8px 24px rgba(0,0,0,0.08)",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "25px",
    marginBottom: "30px",
  },

  chartCard: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
      "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  },

  insight: {
    background: "#f9fafb",
    padding: "18px",
    borderRadius: "12px",
    marginBottom: "15px",
    fontSize: "18px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  badge: {
    padding: "8px 16px",
    borderRadius: "999px",
    fontWeight: "700",
  },
};