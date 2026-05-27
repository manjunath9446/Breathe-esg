import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import {
  FaChartLine,
  FaUpload,
  FaClipboardCheck,
  FaLeaf,
} from "react-icons/fa";

import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Review from "./pages/Review";

function Sidebar() {

  const location = useLocation();

  const menuItems = [

    {
      name: "Dashboard",
      path: "/",
      icon: <FaChartLine />,
    },

    {
      name: "Data Ingestion",
      path: "/upload",
      icon: <FaUpload />,
    },

    {
      name: "Analyst Review",
      path: "/review",
      icon: <FaClipboardCheck />,
    },
  ];

  return (

    <div style={styles.sidebar}>

      <div>

        <div style={styles.logoSection}>

          <div style={styles.logoIcon}>
            <FaLeaf />
          </div>

          <h1 style={styles.logo}>
            Breathe ESG
          </h1>

          <p style={styles.tagline}>
            Sustainability Intelligence Platform
          </p>

        </div>

        <div style={styles.menu}>

          {menuItems.map((item) => {

            const active =
              location.pathname === item.path;

            return (

              <Link
                key={item.name}
                to={item.path}
                style={{
                  ...styles.link,
                  ...(active
                    ? styles.activeLink
                    : {}),
                }}
              >

                <span style={styles.icon}>
                  {item.icon}
                </span>

                <span>{item.name}</span>

              </Link>
            );
          })}

        </div>

      </div>

      <div style={styles.footer}>

        ESG Emissions Management System

      </div>

    </div>
  );
}

function AppLayout() {

  return (

    <div style={styles.appContainer}>

      <Sidebar />

      <div style={styles.mainContent}>

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/upload"
            element={<Upload />}
          />

          <Route
            path="/review"
            element={<Review />}
          />

        </Routes>

      </div>

    </div>
  );
}

export default function App() {

  return (

    <BrowserRouter>

      <AppLayout />

    </BrowserRouter>
  );
}

const styles = {

  appContainer: {
    display: "flex",
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  sidebar: {
    width: "280px",
    height: "100vh",
    background:
      "linear-gradient(180deg,#020617,#0f172a)",
    color: "white",
    padding: "30px 20px",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow:
      "4px 0 20px rgba(0,0,0,0.3)",
  },

  logoSection: {
    marginBottom: "50px",
  },

  logoIcon: {
    width: "72px",
    height: "72px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg,#10b981,#22c55e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    marginBottom: "18px",
    boxShadow:
      "0 10px 30px rgba(16,185,129,0.4)",
  },

  logo: {
    fontSize: "38px",
    fontWeight: "800",
    margin: 0,
    color: "#ffffff",
  },

  tagline: {
    color: "#94a3b8",
    marginTop: "10px",
    fontSize: "14px",
    lineHeight: "22px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 18px",
    borderRadius: "16px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "600",
    transition: "0.3s",
    background: "rgba(255,255,255,0.03)",
  },

  activeLink: {
    background:
      "linear-gradient(90deg,#10b981,#059669)",
    color: "white",
    boxShadow:
      "0 8px 20px rgba(16,185,129,0.35)",
  },

  icon: {
    fontSize: "20px",
  },

  footer: {
    color: "#64748b",
    fontSize: "13px",
    textAlign: "center",
    lineHeight: "22px",
    paddingTop: "20px",
    borderTop:
      "1px solid rgba(255,255,255,0.08)",
  },

  mainContent: {
    marginLeft: "280px",
    width: "100%",
    padding: "30px",
  },
};