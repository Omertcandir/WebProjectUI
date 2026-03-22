# IRONFORGE — Elite Fitness Platform

React + Vite frontend for the IronForge fitness platform.

## Tech Stack

- **React 18** + **Vite 5**
- **React Router DOM v6** — client-side routing
- **CSS Modules** — scoped component styles
- **Fetch API** — REST calls to backend

## Project Structure

```
src/
├── api/
│   └── index.js          # All API calls (auth, workouts, plans, progress)
├── components/
│   ├── Navbar.jsx/.css   # Top navigation
│   ├── Sidebar.jsx/.css  # Dashboard sidebar
│   ├── UI.jsx/.css       # Reusable: Button, Input, Select, Alert, Badge, Card
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx   # Global auth state + JWT management
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── Login.jsx         # POST /api/auth/login
│   ├── Register.jsx      # POST /api/auth/register
│   ├── Dashboard.jsx     # Protected dashboard shell
│   └── dashboard/
│       ├── Overview.jsx  # Stats + recent sessions + progress chart
│       ├── Sessions.jsx  # Full sessions list with complete action
│       ├── Plans.jsx     # Subscription plan selector
│       └── Progress.jsx  # Measurement form + history
├── App.jsx               # Router setup
├── main.jsx              # Entry point
└── index.css             # CSS variables + global base
```

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## API Endpoints Used

| Method | Endpoint | Page |
|--------|----------|------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/workouts/members/{id}/sessions` | Dashboard |
| PUT | `/api/workouts/sessions/{id}/complete` | Sessions |
| GET | `/api/subscriptions/plans` | Plans |
| POST | `/api/subscriptions/select-plan` | Plans |
| POST | `/api/progress/measurements` | Progress |
| GET | `/api/progress/members/{id}/chart` | Progress |

## Auth Flow

1. Login/Register → receive JWT token
2. Token stored in `localStorage`
3. All protected API calls send `Authorization: Bearer <token>`
4. `ProtectedRoute` redirects unauthenticated users to `/login`

## Environment

API base URL is set in `src/api/index.js`:
```js
const API_BASE = 'http://64.226.125.254'
```

To use a proxy during development, `vite.config.js` is already configured:
```js
proxy: { '/api': { target: 'http://64.226.125.254', changeOrigin: true } }
```
