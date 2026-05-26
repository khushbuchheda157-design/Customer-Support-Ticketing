# Datastraw Ticketing CRM System

A world-class, premium SaaS-grade Customer Support CRM developed for **Datastraw Technologies** — a Mumbai-based CX outsourcing leader serving high-growth digital-first brands with 24/7 support.

Designed with inspiration from *Stripe*, *Linear*, *Notion*, and *Zendesk*, this ticketing CRM operates with premium dark mode, elegant glassmorphic panels, staggered list loading, optimistic UI, relative date-fns timestamps, live stats trackers, and fully validated ticket creation steps.

---

## 🚀 Key Features

1. **Dashboard Overview**: Live counter stats cards demonstrating Open, In-progress, Closed, and High Priority counts.
2. **Robust Filters & Live Search**: Dynamic client-side routing, debounce-based live search (keyboard shortcut `/` to focus), and multi-criteria status/priority filters.
3. **Advanced Detail Panels**: 60/40 two-column interface showing ticket controls, and custom note timelines supporting automatic relative time stamps.
4. **Responsive Drawer Sidebar**: Premium custom navigation slides seamlessly on tablet/mobile screens with complete iOS safe area pads.
5. **Theme Controller**: Seamlessly synced system preference or custom toggle saved directly in browser's local storage.
6. **Robust SQLite Core**: Fully sequential, zero-padded ID generation (`TKT-001`, `TKT-002`) built via `better-sqlite3`.

---

## 🛠️ Tech Stack

- **Backend**: Node.js & Express
- **Database**: SQLite (`better-sqlite3`)
- **Frontend**: React (Vite) + Tailwind CSS v3
- **Animations**: Framer Motion
- **Toast Notifications**: `react-hot-toast`
- **Date Utilities**: `date-fns`
- **Deployment**: Monorepo standard (Backend serving frontend static build)

---

## ⚙️ How to Run Locally

### 1. Prerequisite Installations
Ensure Node.js is installed.

### 2. Install Dependencies
Install all required modules from the repository root:
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Running in Development Mode
Run the backend API and the Vite React frontend in parallel:

**Start Express Backend Server (Port 5000)**:
```bash
cd backend
npm run dev # or node server.js
```

**Start React Client Dev Server (Port 5173)**:
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser. All API requests are automatically proxied to Port 5000.

---

## 📦 Deployment Command (Render.com)

The system is configured as a monorepo setup ready for immediate Render.com hosting:

- **Build Command**:
  ```bash
  cd frontend && npm install && npm run build && cd ../backend && npm install
  ```
- **Start Command**:
  ```bash
  node backend/server.js
  ```
