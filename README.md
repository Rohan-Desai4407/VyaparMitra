# 🚀 VyaparMitra (व्यापारमित्र)

> **Plan • Grow • Prosper** — AI-Driven Hyper-Local Business Feasibility & Financial Advisory Platform for Indian Entrepreneurs.

[![React 19](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748.svg)](https://www.prisma.io/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5%20%2F%203.6-orange.svg)](https://deepmind.google/technologies/gemini/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Overview

**VyaparMitra** is an intelligent web application designed to empower grassroots and rural entrepreneurs across India. By combining official demographic & geographic data (LGD), localized market intelligence, government loan policy schemes, and Google Gemini AI, VyaparMitra provides clear, deterministic business feasibility studies, cash flow simulations, SWOT assessments, and loan-readiness reports.

---

## 🌟 Key Features & Architecture Modules

### 1. 📍 Hyper-Local Business Assessment Form (`/assessment`)
- State, District, Sub-District (Block), and Village selection backed by official LGD (Local Government Directory) datasets.
- 10% Margin Capital model calculation (Project Cost = Margin Capital ÷ 10%, Maximum Loan = 90%).
- Multilingual selection (English, Hindi, Gujarati, Tamil, Telugu, Marathi, Punjabi, Bengali, Odia, Kannada, Malayalam).

### 2. 📊 Market Analysis (`/market-analysis`)
- Dynamic 5km, 10km, 15km, and 25km consumer reach estimation.
- Competitor density analysis and nearby enterprise tracking.
- Purchasing power index and product pricing benchmarks with modal breakdowns.
- Primary distribution channels & top unserved market opportunities.
- Actionable revenue expansion strategies & Leaflet-based interactive geolocation map.

### 3. 🛡️ AI SWOT & Risk Advisor (`/swot-risk-advisor`)
- AI-driven 4-quadrant strategic matrix (Strengths, Weaknesses, Opportunities, Threats).
- Expandable evidence cards with confidence ratings and impact badges.
- Instant "Ask AI About This" integration directing into the conversational advisor.
- Hyper-local risk factor breakdown (supply bottlenecks, seasonal volatility, utility reliability).
- Prioritized action recommendations.

### 4. 💰 Smart Financial Calculator & Scheme Router (`/financial-planner` & `/scheme-router`)
- Live margin capital slider with instant recalculation of project costs, equity, and debt.
- Automatic routing to matching government policies (Micro Finance Scheme vs. Term Loan Scheme / PMEGP / Mudra).
- Interest rate, tenure, and moratorium grace period analysis.

### 5. 📅 Repayment & EMI Amortization Schedule (`/repayment-schedule`)
- Month-by-month and quarterly installment breakdown.
- Grace period / moratorium handling before principal repayment.
- Cumulative interest and reducing balance calculations.

### 6. 🤖 Multilingual AI Advisor (`/ai-advisor`)
- Natural language conversational assistant powered by Google Gemini.
- Voice typing with real-time speech-to-text and automated text-to-speech translation in regional Indian languages.
- Persistent multi-session chat history.

### 7. 📈 What-if Financial Simulator (`/what-if-simulator`)
- Stress-test business models against sales volume changes, price shifts, raw material inflation, and interest rate hikes.
- Real-time 12-month net cashflow projection chart & SVG donut cost distribution.
- Financial Health Score and DSCR (Debt Service Coverage Ratio) monitoring.

### 8. 📄 Final Feasibility & Loan Readiness Report (`/final-report`)
- Consolidated appraisal report ready for bank submission, DIC verification, and loan sanction.
- Includes official checklists (Udyam, Aadhaar, PAN, residence proof, quotations).
- Clean print and PDF export styling.

### 9. ⚙️ Admin Portal (`/admin/*`)
- Secure dashboard for user administration, audit logs, scheme rule configurations, and analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 6, React Router v7 |
| **Styling & Icons** | Tailwind CSS v4, Lucide React, Custom SVG Icons |
| **Charts & Visuals** | ApexCharts, React-ApexCharts, Leaflet, React-Leaflet |
| **Internationalization**| i18next, react-i18next (English, Hindi, Gujarati, etc.) |
| **Backend & API** | Node.js, Express, TypeScript |
| **Database & ORM** | MongoDB / PostgreSQL via Prisma ORM v5.22 |
| **AI & LLM** | Google Gemini Generative AI SDK (`@google/genai`, `@google/generative-ai`) |

---

## 📁 Project Structure

```
VyaparMitra/
├── backend/                  # Express + TypeScript + Prisma backend
│   ├── prisma/
│   │   └── schema.prisma     # Database schemas (Schemes, Assessments, Simulations)
│   ├── scripts/              # Seeding and data import scripts (LGD locations)
│   └── src/
│       ├── controllers/      # Route controllers (schemes, simulations, swot)
│       ├── middleware/       # Auth and admin role middlewares
│       ├── routes/           # REST API routes
│       ├── services/         # Business logic and AI Gemini integrations
│       └── server.ts         # Backend entry point
├── public/                   # Static assets, logos, and icons
├── src/
│   ├── components/           # Reusable UI components, modals, charts, and maps
│   ├── context/              # React contexts (VyaparContext, NotificationContext, SidebarContext)
│   ├── data/                 # Canonical Indian states, districts, blocks & village data
│   ├── hooks/                # Custom React hooks (market intelligence, SWOT, financial)
│   ├── icons/                # Custom SVG icons
│   ├── layout/               # App layout, header, sidebar, and admin navigation
│   ├── locales/              # i18n translation JSON dictionaries (en, hi, gu, ta, te, etc.)
│   ├── pages/                # Application pages & route components
│   │   ├── Dashboard/        # Dashboard overview
│   │   ├── MarketAnalysis.tsx# Dedicated Market Intelligence page
│   │   ├── SwotRiskAdvisor.tsx# Dedicated AI SWOT & Risk page
│   │   ├── FinancialPlanner.tsx
│   │   ├── SchemeRouter.tsx
│   │   ├── RepaymentSchedule.tsx
│   │   ├── AiAdvisor.tsx     # Voice & conversational AI chat
│   │   ├── WhatIfSimulator.tsx# Scenario stress testing
│   │   └── FinalReport.tsx   # Bank-ready feasibility report
│   ├── services/             # API services and client integration
│   ├── App.tsx               # App routing configuration
│   └── main.tsx              # React entry point
└── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.x or later (Node 20+ recommended)
- **npm** or **yarn**
- **Gemini API Key**: (Optional for live AI features, mock fallbacks provided)

### 2. Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rohan-Desai4407/VyaparMitra.git
   cd VyaparMitra
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   npx prisma generate
   cd ..
   ```

### 3. Environment Setup

Create `.env` in the root directory:
```env
VITE_API_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Create `backend/.env`:
```env
PORT=3001
DATABASE_URL="your_mongodb_or_postgres_connection_string"
JWT_SECRET="your_jwt_secret_key"
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Running the Development Server

- **Start Frontend:**
  ```bash
  npm run dev
  ```
  *(Default frontend URL: `http://localhost:5173`)*

- **Start Backend:**
  ```bash
  cd backend
  npm run dev
  ```
  *(Default API URL: `http://localhost:3001`)*

### 5. Production Build

To test and compile both frontend and backend:
```bash
# Build Frontend
npm run build

# Build Backend
cd backend && npm run build
```

---

## 🌐 Available Routes

| Route | Description |
| :--- | :--- |
| `/` | Landing Page & Portal Overview |
| `/dashboard` | User Feasibility & Metric Summary Dashboard |
| `/assessment` | Business Category, Location & Capital Parameter Form |
| `/market-analysis` | Hyper-Local Market Demographics, Competitors, & Pricing |
| `/swot-risk-advisor` | AI-Driven SWOT Matrix, Risk Breakdown & Recommendations |
| `/financial-planner` | Capital Ratio & Margin Calculation Simulator |
| `/scheme-router` | Auto-Matched Government Scheme Selection & Matrix |
| `/repayment-schedule`| Loan EMI & Moratorium Amortization Schedule |
| `/ai-advisor` | Multilingual NLP AI Business Advisor with Voice Typing |
| `/what-if-simulator` | Stress-Testing What-if Financial Simulator |
| `/final-report` | Bank-Ready Feasibility & Loan Readiness Report |
| `/admin/*` | Administrative Management & Audit Controls |

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
