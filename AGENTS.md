# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run lint      # ESLint
npm run preview   # preview production build locally
```

No test runner configured.

## Environment

Requires `.env.local` with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

React 19 + Vite SPA with Supabase as backend (auth + DB + RLS).

**Auth flow**: `AuthProvider` (`src/context/AuthContext.jsx`) wraps entire app. Exposes `{ user, profile, signIn, signUp, signOut, loading }` via `useAuth()`. `profile` comes from `public.profiles` table (synced from `auth.users` via trigger). `loading` gates render — children only mount after session resolves.

**Route guards**: `src/components/RouteGuards.jsx` — `ProtectedRoute` checks `user`, `AdminRoute` additionally checks `profile.role === 'admin'`.

**DB schema** (Supabase, managed via `supabase/migrations/`):
- `profiles` — extends `auth.users`, has `role: 'user' | 'admin'`
- `courts` — sport: `badminton | squash | tennis`
- `time_slots` — per-court, per-day-of-week recurring slots (7 AM–9 PM seeded)
- `bookings` — links user+court+slot+date, status: `pending | approved | rejected | cancelled`, unique on `(court_id, slot_id, booking_date)`

All tables have RLS enabled. Policies are in separate migration files.

**Pages**: `LoginPage`, `SignUpPage`, `CourtsPage`, `CourtDetail` (`:courtId`), `MyBookings`, `AdminDashboard` (`/admin`).

**Mixed JSX/TSX**: core files (`App.jsx`, `AuthContext.jsx`, `RouteGuards.jsx`, `supabaseClient.js`) are JS; pages are `.tsx`. tsconfig is strict but `noEmit: true` — TypeScript is type-check only, Vite handles transpilation.

## Supabase Migrations

New migrations go in `supabase/migrations/` with timestamp prefix. Apply via Supabase MCP or `supabase db push`.
