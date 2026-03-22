# IRONFORGE UI

IRONFORGE UI is a React + Vite frontend integrated with WebProjectService.

## Stack

- React 18
- Vite 5
- React Router DOM 6
- CSS Modules
- Fetch API

## Quick Start

```bash
npm install
npm run dev
```

App URL: http://localhost:5173

Build for production:

```bash
npm run build
```

## Backend Configuration

- Backend base URL: http://64.226.125.254
- Swagger UI: http://64.226.125.254/swagger/index.html
- OpenAPI JSON: http://64.226.125.254/swagger/v1/swagger.json
- Health: http://64.226.125.254/health

Default Vite proxy target is already set to:

```bash
VITE_PROXY_TARGET=http://64.226.125.254
```

## Environment Variables

Use a `.env` file in the project root.

```bash
VITE_API_BASE_URL=
VITE_PROXY_TARGET=http://64.226.125.254
```

Rules:

- If `VITE_API_BASE_URL` is empty, the app uses `/api` with the Vite proxy.
- Proxy behavior is controlled by `VITE_PROXY_TARGET` in `vite.config.js`.

## API Notes

Swagger confirms these groups and routes are available:

- Auth
- Members
- Progress
- Subscriptions
- Workouts
- Finance
- Notifications

Current frontend integration uses:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/subscriptions/plans`
- `POST /api/subscriptions/select-plan`
- `GET /api/workouts/members/{memberId}/sessions`
- `PUT /api/workouts/sessions/{workoutSessionId}/complete`
- `POST /api/progress/measurements`
- `GET /api/progress/members/{memberId}/chart`

## Auth Flow

1. Login/Register stores `token` and `user` in localStorage.
2. Protected API calls send `Authorization: Bearer <token>`.
3. Unauthenticated users are redirected to `/login`.

## Commands

- `npm run dev`: start development server
- `npm run build`: build production bundle
- `npm run preview`: run local production preview

## Project Structure

```text
src/
  api/
    index.js
  components/
    ProtectedRoute.jsx
    Navbar.jsx
    Sidebar.jsx
    UI.jsx
  context/
    AuthContext.jsx
  pages/
    Home.jsx
    Login.jsx
    Register.jsx
    Dashboard.jsx
    dashboard/
      Overview.jsx
      Sessions.jsx
      Plans.jsx
      Progress.jsx
```

## Git Notes

This repo includes a React/Vite-focused `.gitignore`.

If generated folders were previously tracked:

```bash
git rm -r --cached node_modules dist
git add .
git commit -m "chore: stop tracking generated folders"
```