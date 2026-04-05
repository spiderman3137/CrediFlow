<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

# 💰 CrediFlow — Loan Information Management System

> A modern, multi-role platform for end-to-end loan lifecycle management — from application to repayment tracking — built with React 19, Tailwind CSS 4, and Recharts.

<p align="center">
  <strong>⚡ Fast</strong> · <strong>🎨 Beautiful</strong> · <strong>🌙 Dark Mode</strong> · <strong>📱 Responsive</strong>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Demo Credentials](#-demo-credentials)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Utility Functions](#-utility-functions)
- [Scripts](#-scripts)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔎 Overview

**CrediFlow** is a fully client-side Loan Information Management System (LIMS) designed for the **Indian financial market**. It provides dedicated dashboards for four distinct user roles — **Admin**, **Lender**, **Borrower**, and **Analyst** — each with tailored workflows, KPIs, and data visualizations.

The platform covers the complete loan lifecycle: application, approval, disbursement, EMI scheduling, repayment tracking, and risk analysis.

> **Note:** This is a frontend prototype using mock data and `localStorage` for persistence. No backend server is required.

---

## ✨ Features

### 🏛️ Platform-Wide
- 🌙 **Dark mode** — enabled by default, toggleable, preference persisted
- 🔐 **Role-based access control** — routes and navigation adapt per role
- 🧮 **Interactive EMI Calculator** — with sliders for principal, rate, and tenure
- 📊 **Rich data visualizations** — line, bar, and area charts via Recharts
- 🔢 **Math CAPTCHA** on login for bot protection
- 💾 **Session persistence** — survives page reloads via `localStorage`
- 🇮🇳 **INR currency formatting** with Indian numbering system

### 👤 Per-Role Highlights

| Role | Key Capabilities |
|------|-----------------|
| **Admin** | User management, loan oversight, security monitoring, platform analytics |
| **Lender** | Create loan offers, track repayments, portfolio dashboard |
| **Borrower** | Apply for loans, view EMI schedule, track payment history |
| **Analyst** | Risk segmentation, default rate tracking, repayment trend analysis |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19.2 (JSX) |
| **Routing** | React Router DOM 7.13 |
| **Build Tool** | Vite 7.3 |
| **Styling** | Tailwind CSS 4.2 + CSS Custom Properties |
| **Charts** | Recharts 3.7 |
| **Forms** | Formik 2.4 + Yup 1.7 |
| **Icons** | Lucide React |
| **State** | React Context API |
| **Persistence** | localStorage |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/crediflow.git
cd crediflow

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173/**

---

## 🔑 Demo Credentials

Use these pre-configured accounts to explore each role:

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | `admin@crediflow.com` | `admin123` |
| 🏦 Lender | `lender@crediflow.com` | `lender123` |
| 👤 Borrower | `borrower@crediflow.com` | `borrower123` |
| 📈 Analyst | `analyst@crediflow.com` | `analyst123` |

> **Tip:** You can also register new accounts through the Register page.

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root component with routing
├── main.jsx                   # Entry point
├── index.css                  # Global styles & Tailwind imports
│
├── components/                # Reusable UI components
│   ├── AppShell.jsx           #   Layout wrapper (Sidebar + TopNav)
│   ├── Sidebar.jsx            #   Collapsible role-aware navigation
│   ├── TopNav.jsx             #   Header bar with user info & dark mode
│   ├── StatCard.jsx           #   KPI card with icon & change indicator
│   ├── StatusBadge.jsx        #   Colored status badge
│   ├── LoanCard.jsx           #   Loan detail card with progress
│   └── EMICalculator.jsx      #   Interactive EMI calculator
│
├── context/
│   └── AuthContext.jsx        # Authentication state management
│
├── data/
│   └── mockData.js            # Seed data (users, loans, transactions)
│
├── pages/
│   ├── LandingPage.jsx        # Public landing page
│   ├── Login.jsx              # Login with role selector + CAPTCHA
│   ├── Register.jsx           # Registration with role picker
│   ├── Admin/                 # Admin-only pages
│   │   ├── AdminDashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Loans.jsx
│   │   ├── Security.jsx
│   │   └── Analytics.jsx
│   ├── Lender/                # Lender-only pages
│   │   ├── LenderDashboard.jsx
│   │   ├── LoanOffers.jsx
│   │   └── Repayments.jsx
│   ├── Borrower/              # Borrower-only pages
│   │   ├── BorrowerDashboard.jsx
│   │   └── MyLoans.jsx
│   └── Analyst/               # Analyst-only pages
│       └── AnalystDashboard.jsx
│
└── utils/
    └── calculations.js        # EMI, eligibility, formatting utilities
```

---

## 👥 User Roles

### 🛡️ Admin
Full platform oversight and management capabilities.
- **Dashboard** — Total users, active loans, transactions, system alerts
- **User Management** — View and manage all users (Active / Suspended / Pending)
- **Loan Records** — Platform-wide loan overview
- **Security** — Monitor failed logins, overdue thresholds, maintenance alerts
- **Analytics** — Loan trend charts (disbursed vs. repaid), activity timeline

### 🏦 Lender
Portfolio management and loan offer creation.
- **Dashboard** — Active offers, total disbursed, borrower count, avg interest rate
- **Loan Offers** — Create and manage lending offers
- **Repayments** — Track collected vs. pending amounts with chart breakdowns
- **EMI Calculator** — Estimate returns on loan offers

### 👤 Borrower
Loan application and repayment tracking.
- **Dashboard** — Active loans, total borrowed, total repaid, next EMI date
- **My Loans** — View loan details with full EMI schedule (principal / interest / balance)
- **Apply** — Submit new loan applications
- **EMI Calculator** — Plan loan affordability

### 📈 Analyst
Data-driven risk assessment and portfolio analysis.
- **Dashboard** — Loans analysed, default rate, avg loan value, high-risk accounts
- **Trends** — Repayment pattern analysis (on-time vs. late vs. defaulted)
- **Distribution** — Loan type breakdown (Home, Education, Medical, Business, etc.)
- **Risk Segmentation** — Low / Medium / High risk categorization with percentages

---

## 🧮 Utility Functions

The `calculations.js` module provides essential financial utilities:

| Function | Description |
|----------|-------------|
| `calculateEMI()` | Standard EMI formula |
| `calculateTotalInterest()` | Total interest payable over loan tenure |
| `calculateTotalPayable()` | Total amount (principal + interest) |
| `generateEMISchedule()` | Full monthly amortization schedule |
| `checkLoanEligibility()` | Rule-based check (credit score ≥ 650, EMI ≤ 50% of income) |
| `formatCurrency()` | INR formatting with Indian numbering (`₹1,00,000`) |
| `formatDate()` | Indian locale date formatting |
| `isValidEmail()` | Email validation |
| `isValidPhone()` | Indian phone number validation |

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint for code quality checks |

---

## 🎨 Design System

- **Primary Color:** Purple (`#5B2D8B`)
- **Font:** Inter (sans-serif)
- **Dark Mode:** Class-based toggle with CSS custom properties
- **Theming:** Consistent color tokens via Tailwind + CSS variables

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using React + Vite + Tailwind CSS
</p>
