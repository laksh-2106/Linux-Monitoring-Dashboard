# 🖥️ Sentinel – Linux Monitoring Dashboard

<p align="center">
  A Modern Linux Server Monitoring Dashboard
</p>

<p align="center">
  Built with React, TypeScript, Tailwind CSS and Supabase
</p>

---

## 📌 Project Overview

Sentinel is a modern and responsive Linux Server Monitoring Dashboard
designed to visualize and manage the health of multiple Linux servers
from a centralized interface.

It provides server management, resource utilization monitoring,
automated alert generation, and server health visualization.

The project demonstrates practical Linux monitoring concepts,
frontend development, database integration, and cloud engineering fundamentals.

## ✨ Features

### 1. Dashboard Overview
- Centralized monitoring dashboard.
- Total monitored servers.
- Healthy and critical server summaries.
- Open alerts overview.
- Server resource utilization history.

### 2. Server Management
- Add new Linux servers.
- Edit existing server details.
- Delete server records.
- Manage hostname and IP address.
- Organize servers by environment:
  - Production
  - Staging
  - Development

### 3. Resource Monitoring
- CPU utilization.
- Memory utilization.
- Disk utilization.
- Network activity.
- Server uptime.
- Operating system information.
- Process count.

### 4. Automated Alert Management

Sentinel automatically generates alerts when resource
utilization crosses configured thresholds.

| Status | Usage |
|--------|-------|
| Healthy | Below 75% |
| Warning | 75% - 89% |
| Critical | 90% and above |

Additional capabilities:
- Warning and critical alerts.
- Alert history.
- Open alerts filtering.
- Alert acknowledgement.
- Severity-based alert generation.

### 5. Database Integration
- Supabase PostgreSQL database.
- Persistent server records.
- Persistent alert history.
- Server CRUD operations.
- Alert acknowledgement management.

### 6. Responsive UI
- Modern dark-themed interface.
- Responsive dashboard layout.
- Interactive monitoring charts.
- Clean navigation and reusable components.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend development |
| TypeScript | Application programming |
| Vite | Development and build tool |
| Tailwind CSS | UI styling |
| Lucide React | Icons |
| Supabase | Database and backend integration |
| PostgreSQL | Relational database |
| Git & GitHub | Version control |

---

## 📂 Project Structure

```text
Sentinel/
│
├── public/
│
├── src/
│   ├── components/
│   │
│   ├── hooks/
│   │   ├── useFleetTelemetry.ts
│   │   ├── useServers.ts
│   │   └── useAlerts.ts
│   │
│   ├── lib/
│   │   ├── monitoring.ts
│   │   ├── supabase.ts
│   │   └── telemetry.ts
│   │
│   ├── pages/
│   │   ├── OverviewPage.tsx
│   │   ├── ServersPage.tsx
│   │   └── AlertsPage.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── supabase/
│   └── migrations/
│
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
└── README.md
