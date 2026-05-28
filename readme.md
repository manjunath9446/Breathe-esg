# Breathe ESG 🌱

###  Sustainability Intelligence Platform

Live Demo:  
[Breathe ESG Platform](https://breathesg-alpha.vercel.app/)

---

## 📌 Overview

Breathe ESG is an AI-powered sustainability intelligence platform designed to help enterprises automate ESG (Environmental, Social, Governance) data ingestion, emissions tracking, anomaly detection, and analyst review workflows.

The platform processes sustainability datasets from enterprise systems such as SAP ERP, utility providers, and travel systems to generate normalized carbon emission records and ESG insights.

This project was built as part of an ESG technology assignment focused on scalable sustainability reporting and enterprise-grade ESG workflows.

---

# ✨ Features

## ✅ ESG Data Ingestion Pipeline

- Upload sustainability datasets from:
  - SAP ERP
  - Utility systems
  - Travel systems
- Automated parsing and normalization

---

## ✅ Carbon Emissions Processing

- Scope 1 emissions
- Scope 2 emissions
- Scope 3 emissions
- CO₂e calculation engine
- Emission factor normalization

---

## ✅ AI-Powered ESG Insights

- Sustainability recommendations
- Emission trend analysis
- Risk alerts
- Optimization suggestions

---

## ✅ Analyst Review Desk

- Review pending emission records
- Approve ESG records
- Governance workflow support

---

## ✅ REST API Backend

- Django REST Framework APIs
- ESG batch ingestion APIs
- Emission record APIs
- Approval workflow APIs

---

## ✅ Modern Frontend Dashboard

- React + Vite frontend
- Interactive ESG dashboard
- Real-time API integration
- Responsive enterprise UI

---

# 🏗️ Tech Stack

## Frontend
- React.js
- Vite
- Axios
- React Query
- Tailwind CSS

## Backend
- Django
- Django REST Framework
- PostgreSQL
- Pandas
- Celery (architecture-ready)
- Redis (architecture-ready)

## Deployment
- Vercel (Frontend)
- Render (Backend + PostgreSQL)

---

# 📂 Project Architecture

```bash
Breathe-ESG/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   └── api.js
│
├── backend/
│   ├── config/
│   ├── esg/
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

---

# 🚀 Live Deployment

## Frontend
https://breathesg-alpha.vercel.app/

## Backend API
https://breathe-esg-1-v1zk.onrender.com/api/

---

# 📡 API Endpoints

## Emission Records

```http
GET /api/emissions/
```

---

## Ingestion Batches

```http
GET /api/batches/
POST /api/batches/
```

---

## Approve ESG Record

```http
PATCH /api/emissions/{id}/approve/
```

---

# 🧠 ESG Workflow

## Step 1 — Upload ESG Dataset

Users upload sustainability datasets from SAP, Utility, or Travel systems.

---

## Step 2 — Automated Processing

The backend:
- Parses files
- Cleans raw records
- Calculates CO₂e values
- Normalizes ESG data

---

## Step 3 — ESG Dashboard

The frontend displays:
- Emission analytics
- ESG insights
- Sustainability trends

---

## Step 4 — Analyst Review

Analysts review and approve ESG records through governance workflows.

---

# 📊 ESG Data Processing Capabilities

| Capability | Supported |
|---|---|
| CSV Parsing | ✅ |
| PDF Parsing | ✅ |
| Emission Normalization | ✅ |
| CO₂e Calculation | ✅ |
| ESG Review Workflow | ✅ |
| REST APIs | ✅ |
| PostgreSQL Integration | ✅ |

---

# 🔐 Security & Scalability

- PostgreSQL database integration
- Environment variable configuration
- CORS-enabled API architecture
- Scalable backend design
- Modular ESG processing pipeline

---

# ⚡ Future Enhancements

- Real-time ESG analytics
- AI anomaly detection
- ESG forecasting models
- Multi-tenant enterprise support
- Redis + Celery distributed processing
- ESG reporting exports (PDF/Excel)

---

# 👨‍💻 Author

### Manjunath R K

AI/ML Engineer | Full Stack Developer | ESG Tech Enthusiast

GitHub:  
https://github.com/manjunath9446

---

# 📜 License

This project is developed for educational and assignment purposes.