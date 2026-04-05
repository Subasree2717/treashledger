# 🚀 TREASHLEDGER — Interactive Financial Analytics Interface

A premium, interactive finance dashboard built with **React**, **TypeScript**, and **Tailwind CSS**. This project was engineered as a high-fidelity frontend technical assignment, focusing on data visualization, responsive architecture, and cinematic user interactions.

---

## 🎯 Project Overview
The **TREASHLEDGER** is a strategic financial tool designed to transform raw transaction data into actionable behavioral insights. It solves the problem of "information overload" by using a layered information architecture—prioritizing high-level summaries before diving into complex trend analysis and granular transaction history.

Whether used by an **Admin** for full data control or a **Viewer** for read-only insights, the interface maintains a "glassmorphism" aesthetic that feels modern, secure, and professional.

---

## ✨ Live Features
- **📊 Summary Analytics**: Instant visibility into Total Balance, Monthly Income, and Monthly Expenses through animated cards.
- **📈 Advanced Visualization Grid**: A 2x2 responsive grid featuring:
    - **Balance Trend** (Multi-line chart for cash flow tracking)
    - **Monthly Comparison** (Grouped bars for income vs. expense analysis)
    - **Spending Breakdown** (Donut chart with real-time percentage weighting)
    - **Spending Hierarchy** (Funnel/Pyramid chart for identifying major expense drivers)
- **⚡ Interactive Transactions**: Real-time searching and multi-category filtering with a high-performance list component.
- **🎭 Role-Based Architecture**: Dynamic UI switching between **Admin** (Full Access) and **Viewer** (Read-Only) modes.
- **💡 AI-Driven Insights**: A dedicated panel for behavioral recommendations based on spending patterns.
- **📤 Data Portability**: Instant one-click exports to **CSV** and **JSON** formats.
- **📱 Responsive Design**: A "Mobile-First" approach that adapts seamlessly from 4K monitors to handheld smartphones.
- **✨ Micro-Interactions**: Premium hover-lifts, staggered entrance animations, and chart tooltips for enhanced UX.

---

## 🖥️ Screens Included
- **Dashboard Overview**: The primary cockpit featuring summary cards and the analytics grid.
- **Charts Section**: Deep-dive visualizations for vertical and horizontal trend analysis.
- **Insights Panel**: Contextual feedback based on current financial health.
- **Transactions Section**: A searchable, filterable table for granular bookkeeping.
- **Role Toggle**: A quick-switch mechanism to demonstrate the application's permission-based UI logic.

---

## 🛠️ Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS (Utility-First) |
| **State Management** | Zustand (Persistent Store) |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 📂 Folder Structure
```text
src/
 ├── assets/      # Global static assets (logos, videos)
 ├── components/  # Atomic and Composite UI components
 │    ├── dashboard/ # Feature-specific dashboard components
 │    ├── common/    # Reusable UI primitives (Logo, Buttons)
 │    └── ai/        # Specialized AI/Intelligence components
 ├── hooks/       # Custom React hooks (Auth, Finance logic)
 ├── lib/         # External library configurations (Utils, Styles)
 ├── pages/       # High-level page components (Index, Home, Auth)
 ├── store/       # Centralized Zustand store definitions
 ├── types/       # Global TypeScript interfaces
 └── utils/       # Modular helper functions (Export, Formatters)
```

---

## 📊 Visual Analytics Implemented
1. **Line Chart (Balance Trend)**: Visualizes the delta between income and expenses over the last 6 months to detect seasonal trends.
2. **Bar Chart (Comparison)**: Uses grouped bars to provide a direct visual contrast between monthly earnings and spending.
3. **Pie Chart (Breakdown)**: Employs specific HSL-tailored color palettes to categorize expenses with percentage-based readability.
4. **Pyramid Chart (Hierarchy)**: A unique Funnel visualization that identifies the "Top-Heavy" categories in a user's budget.

---

## 🔐 Role-Based UI Logic
The application implements a robust role-switching mechanism:
- **Admin**: Has full authority to view all sensitive data, export records, and manage the complete financial lifecycle.
- **Viewer**: A restricted view intended for stakeholders or secondary users, disabling administrative actions while maintaining high-level read access.

---

## 🧠 State Management
The project utilizes **Zustand** for lightweight yet powerful global state. It manages:
- **Transactions**: Centralized source of truth for all financial records.
- **Filters**: State governing the search and category queries across the dashboard.
- **User Role**: Persisted state for permission-based rendering.
- **Calculations**: Real-time derived state for balances, savings rates, and trend data.

---

## 🎨 UI/UX Decisions
- **Minimalist Aesthetic**: Reduced visual clutter to keep the focus on financial data points.
- **Glassmorphism**: Subtle backdrop blurs (`backdrop-blur-xl`) and border-glows to convey a futuristic, secure fintech feel.
- **Interactive Lifts**: Every card and interactive element features a subtle `translate-y` hover effect to provide tactile feedback.
- **Staggered Animations**: Used `staggerChildren` from Framer Motion to ensure the UI builds sequentially on load, reducing cognitive load.
- **Accessibility**: High-contrast text and semantic HTML tags for screen reader compatibility.

---

## 📱 Responsiveness
The layout is strictly dynamic:
- **Desktop (1024px+)**: 2-column or 4-column grids for maximum information density.
- **Tablet (768px)**: Optimized grid reflow to prevent cramped charts.
- **Mobile (320px+)**: A clean, single-column content stack with stacked analytics and intuitive scrolling.

---

## 🖱️ Interactions
- **Contextual Tooltips**: Custom-styled Recharts tooltips that match the project theme.
- **Smooth Page Transitions**: Uses Framer Motion's `AnimatePresence` for fluid navigation between routes.
- **Interactive Glows**: Hovering over charts triggers localized glows, drawing the eye to the key data being explored.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development
```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

---

## 📝 Assumptions & Constraints
- **Mock Data**: Transaction history is generated via a robust mock factory located in `src/data/mockData.ts`.
- **Frontend-First**: Built as a client-side powerhouse; no active backend connection is required for functionality.
- **Static Assets**: Background video and logos are optimized for deployment-ready performance.

---

## 🔮 Future Improvements
- **Live Sync**: Integration with Supabase or Firebase for persistent user-generated data.
- **Export Power**: PDF report generation for financial summaries.
- **Theme Engine**: A robust Dark/Light mode toggle (Initial support included).
- **Plaid Integration**: Connecting real bank accounts via API for live transaction streaming.

---

## ✅ Evaluation Criteria Mapping
- [x] **Superior Design**: Implemented custom linear gradients and glassmorphism styling.
- [x] **Responsiveness**: Tested across iPhone, iPad, and Ultra-wide desktop breakpoints.
- [x] **State Management**: Zero prop-drilling achieved via centralized Zustand store.
- [x] **Technical Depth**: Advanced Recharts customization and staggered Framer Motion variants.
- [x] **Code Quality**: Clean, modular folder structure with separation of concerns.

---

## 👤 Author
**[SUBASREE]**
*Frontend Engineer*

