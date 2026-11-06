# Sentinel: Linux Monitoring Dashboard

Sentinel is a web dashboard for keeping an eye on a fleet of Linux servers. It shows live CPU, memory, disk, network, uptime, and process information for each server, raises alerts when usage crosses warning or critical thresholds, and keeps your server list and alert history in a Supabase database.

## Features

- **Fleet overview:** summary cards (servers monitored, healthy, needs attention, open alerts) and a detail panel for each selected server with usage history charts.
- **Servers:** add, edit, and remove servers with name, host or IP, environment (production, staging, development), and operating system.
- **Alerts:** a list of raised alerts with severity, the affected server, and the metric involved. Filter to open alerts or view all, and acknowledge alerts once handled.
- **Automatic alerts:** when a server's CPU, memory, or disk usage reaches 75% (warning) or 90% (critical), an alert is saved. Alerts are only raised when severity increases, so a metric sitting above a threshold does not flood the list.
- **Responsive layout:** the sidebar becomes a horizontal bar on small screens.

## Thresholds

| Level    | Usage |
|----------|-------|
| Healthy  | Below 75% |
| Warning  | 75% to 89% |
| Critical | 90% and above |

## Tech Stack

- [React 18](https://react.dev) with TypeScript
- [Vite](https://vitejs.dev) for the development server and builds
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide React](https://lucide.dev) for icons
- [Supabase](https://supabase.com) (Postgres) for data storage

## Getting Started

### Prerequisites

- Node.js 20.19 or newer (or 22.12 or newer)
- npm
- A Supabase project with the database tables described below

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with your Supabase project URL and public anon key:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The anon key is safe to use in the browser. Do not put a service role key in this file.

### 3. Start the development server

```bash
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`). Open it in your browser.

### 4. Build for production

```bash
npm run build
```

The optimized site is written to `dist/`. To preview that build locally:

```bash
npm run preview
```

### Other scripts

| Command             | Purpose                                  |
|---------------------|------------------------------------------|
| `npm run typecheck` | Checks TypeScript types without building |
| `npm run lint`      | Runs ESLint across the project           |

## Database

The schema lives in `supabase/migrations/20261106181244_create_servers_and_alerts.sql`. Apply it to your Supabase project before first use.

### `servers`

| Column        | Type        | Notes                                              |
|---------------|-------------|----------------------------------------------------|
| `id`          | uuid        | Primary key, generated automatically               |
| `name`        | text        | Required                                           |
| `host`        | text        | Required, hostname or IP address                   |
| `environment` | text        | `production`, `staging`, or `development`          |
| `os_label`    | text        | Operating system label, for example `Ubuntu 22.04` |
| `created_at`  | timestamptz | Set automatically                                  |

### `alerts`

| Column         | Type        | Notes                                                   |
|----------------|-------------|---------------------------------------------------------|
| `id`           | uuid        | Primary key, generated automatically                    |
| `server_id`    | uuid        | References `servers.id`, deleted along with the server  |
| `severity`     | text        | `warning` or `critical`                                 |
| `metric`       | text        | `cpu`, `memory`, or `disk`                              |
| `message`      | text        | Human-readable description                              |
| `acknowledged` | boolean     | Defaults to `false`                                     |
| `created_at`   | timestamptz | Set automatically                                       |

Row Level Security is enabled on both tables. The app has no sign-in, so the anon role has full read and write access. See the security note below before deploying.

## Project Structure

```
src/
  App.tsx                  App shell, page switching, alert wiring
  main.tsx                 Entry point
  index.css                Tailwind base styles
  components/              Reusable UI pieces (sidebar, cards, modals, badges)
  hooks/
    useFleetTelemetry.ts   Live telemetry updates and threshold breach detection
    useServers.ts          Server loading and create, update, delete
    useAlerts.ts           Alert loading, raising, and acknowledging
  lib/
    supabase.ts            Supabase client
    monitoring.ts          Types, thresholds, and formatting helpers
    telemetry.ts           Telemetry generation
  pages/
    OverviewPage.tsx       Fleet overview
    ServersPage.tsx        Server management
    AlertsPage.tsx         Alert list
supabase/
  migrations/              Database schema
```

## Important Notes

### Telemetry is simulated

The browser cannot read the CPU, memory, disk, or network usage of a real Linux machine. Sentinel generates realistic simulated readings for each saved server, updated every two seconds. The server list, alerts, and acknowledgements are real and saved to Supabase. To show real data, a small agent running on each Linux server would need to report its metrics to the database or an API. That is not included in this project.

### Security

There is no sign-in. Anyone who can reach the deployed site can view, change, and delete servers and alerts. Add authentication before using Sentinel with sensitive hosts or on a public address.

## License

Add your license of choice here.
