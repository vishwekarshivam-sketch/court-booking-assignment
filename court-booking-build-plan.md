# Court Booking System — Build Chronology

**Stack:** React.js · Supabase (DB + Auth + API) · Vercel (Deployment)

---

## Phase 0 — Project Scaffolding & Tooling

**Goal:** Have a running shell deployed to Vercel before writing a single feature.

1. `npx create-react-app court-booking` (or Vite: `npm create vite@latest court-booking -- --template react`)
2. Initialise a Git repository and push to GitHub.
3. Install core dependencies upfront:
   - `@supabase/supabase-js` — Supabase client
   - `react-router-dom` — client-side routing
   - `date-fns` — date/time manipulation for slot logic
4. Create `.env.local` with `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` (never commit this file).
5. Create `src/lib/supabaseClient.js` — single shared Supabase instance used everywhere.
6. Connect the GitHub repo to Vercel. Add the two env vars in Vercel's project settings.
7. Verify the blank app deploys cleanly on Vercel's preview URL.

---

## Phase 1 — Supabase Database Schema

**Goal:** All tables exist and have correct relationships before any UI reads or writes data.

### 1.1 — Enable Row Level Security (RLS) globally
Turn on RLS on every table at creation time. All policies start as DENY-all; open them up deliberately as features are built.

### 1.2 — Create tables in this exact order (to respect foreign keys):

**`profiles`** (extends Supabase `auth.users`)
```
id          uuid  PK  references auth.users(id)
full_name   text
role        text  DEFAULT 'user'   -- 'user' | 'admin'
created_at  timestamptz DEFAULT now()
```

**`courts`**
```
id          uuid  PK  DEFAULT gen_random_uuid()
name        text  NOT NULL          -- e.g. "Badminton Court 1"
sport       text  NOT NULL          -- 'badminton' | 'squash' | 'tennis'
is_active   bool  DEFAULT true
created_at  timestamptz DEFAULT now()
```

**`time_slots`** *(static lookup — defines valid slot windows per day)*
```
id          uuid  PK  DEFAULT gen_random_uuid()
court_id    uuid  FK  references courts(id)
day_of_week int   NOT NULL          -- 0=Sun … 6=Sat
start_time  time  NOT NULL          -- e.g. '07:00'
end_time    time  NOT NULL          -- e.g. '08:00'
```

**`bookings`**
```
id              uuid  PK  DEFAULT gen_random_uuid()
user_id         uuid  FK  references profiles(id)
court_id        uuid  FK  references courts(id)
slot_id         uuid  FK  references time_slots(id)
booking_date    date  NOT NULL
status          text  DEFAULT 'pending'   -- 'pending' | 'approved' | 'rejected'
created_at      timestamptz DEFAULT now()
UNIQUE (court_id, slot_id, booking_date)   -- prevents double-booking
```

### 1.3 — Seed courts & time slots
Insert 2–3 courts per sport and a full week of hourly slots (07:00–21:00) using Supabase's Table Editor or a seed SQL file committed to the repo.

### 1.4 — Create a Supabase Database Function
```sql
-- Automatically creates a profiles row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## Phase 2 — Authentication

**Goal:** Users can sign up, log in, and log out. Role is determined from `profiles.role`.

### 2.1 — Supabase Auth setup
- Enable Email/Password provider in Supabase dashboard.
- (Optional) Enable email confirmation; disable for development speed.

### 2.2 — React Auth context (`src/context/AuthContext.jsx`)
- Wraps entire app.
- Exposes: `user`, `profile` (with role), `signUp()`, `signIn()`, `signOut()`, `loading`.
- On mount: calls `supabase.auth.getSession()` and immediately fetches the matching `profiles` row.
- Subscribes to `supabase.auth.onAuthStateChange` to keep state in sync.

### 2.3 — Pages & routing
```
/login          — sign-in form
/signup         — sign-up form
/                — redirects based on role after login
```

### 2.4 — Route guards
- `<ProtectedRoute>` — redirects to `/login` if no session.
- `<AdminRoute>` — additionally checks `profile.role === 'admin'`; redirects to `/` otherwise.

### 2.5 — RLS policies for `profiles`
```sql
-- Users can read and update only their own profile
create policy "Own profile" on profiles
  for all using (auth.uid() = id);
```

---

## Phase 3 — Court & Slot Availability (Read-Only)

**Goal:** Any logged-in user can browse courts and see which slots are free on a given date.

### 3.1 — RLS: allow authenticated reads
```sql
create policy "Anyone can view courts"     on courts     for select using (true);
create policy "Anyone can view time_slots" on time_slots for select using (true);
create policy "Anyone can view bookings"   on bookings   for select using (true);
```

### 3.2 — Data-fetching hooks
- `useCourts()` — fetches all active courts, optionally filtered by sport.
- `useAvailableSlots(courtId, date)` — fetches all `time_slots` for the court's day-of-week, then LEFT JOINs against `bookings` where `booking_date = date AND status != 'rejected'`. Returns each slot tagged as available or taken.

### 3.3 — URL structure for the availability view
```
/courts                        — list all courts
/courts/:courtId?date=YYYY-MM-DD  — slot grid for one court on one date
```

---

## Phase 4 — Booking Creation (User Flow)

**Goal:** A logged-in user can request a booking for an available slot.

### 4.1 — RLS: users can insert their own bookings
```sql
create policy "Users can create bookings" on bookings
  for insert with check (auth.uid() = user_id);
```

### 4.2 — Booking flow (single page, no multi-step wizard yet)
1. User picks a court → picks a date → sees slot grid.
2. User clicks an available slot → confirmation dialog shows court, date, time.
3. On confirm: `supabase.from('bookings').insert(...)` is called.
4. The `UNIQUE` constraint on `(court_id, slot_id, booking_date)` is the final race-condition guard. Handle the `23505` Postgres error code gracefully ("This slot was just taken — please choose another").
5. On success: redirect to `/my-bookings`.

### 4.3 — `useMakeBooking()` hook
Encapsulates the insert call, optimistic UI update, and error normalisation.

---

## Phase 5 — User Booking Dashboard

**Goal:** Users can see all their own bookings and their current status.

### 5.1 — RLS: users can read only their own bookings
```sql
create policy "Users see own bookings" on bookings
  for select using (auth.uid() = user_id);
```

### 5.2 — `/my-bookings` page
- Fetches bookings joined with `courts` and `time_slots`.
- Groups by status: Pending / Approved / Rejected.
- Shows booking date, court name, sport, time, and status badge.
- No cancellation in this phase (add later if required).

---

## Phase 6 — Admin Dashboard

**Goal:** Admins can see all bookings and approve or reject pending ones.

### 6.1 — Promote the first user to admin
Manually run in Supabase SQL editor:
```sql
update profiles set role = 'admin' where id = '<your-user-uuid>';
```

### 6.2 — RLS: admins can read all bookings and update status
```sql
create policy "Admins read all bookings" on bookings
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins update booking status" on bookings
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
```

### 6.3 — `/admin` page
- Fetches all bookings joined with `profiles`, `courts`, `time_slots`.
- Filter tabs: All / Pending / Approved / Rejected.
- Each row has **Approve** and **Reject** action buttons (disabled if already actioned).
- On action: `supabase.from('bookings').update({ status: ... }).eq('id', ...)`.
- Real-time updates via `supabase.channel('bookings').on('postgres_changes', ...)` so approvals from other admin sessions appear instantly.

### 6.4 — Admin: Court Management (basic)
- `/admin/courts` — toggle `is_active` on courts (soft-disable without deleting slots).
- No court creation UI yet (use Supabase Table Editor for now).

---

## Phase 7 — Real-Time Slot Availability

**Goal:** The slot grid updates live without requiring a page refresh.

- In `useAvailableSlots`, subscribe to `supabase.channel` on the `bookings` table filtered by `court_id` and `booking_date`.
- On any `INSERT` or `UPDATE` event, re-run the availability query.
- Unsubscribe on component unmount.

---

## Phase 8 — Vercel Production Deployment

**Goal:** The app is live, stable, and environment-separated.

1. Merge `main` branch — Vercel auto-deploys.
2. Confirm all Vercel env vars match production Supabase project keys.
3. In Supabase: add the Vercel production URL to **Authentication → URL Configuration → Site URL** and **Redirect URLs**.
4. Smoke-test the full user flow: sign up → book → check status.
5. Smoke-test admin flow: log in as admin → approve/reject a booking.

---

## Phase 9 — Polish & Edge Cases (after core is working)

Address these only after Phases 0–8 are verified end-to-end:

- **Past date guard** — disable slot selection for dates before today on the frontend AND add a DB check constraint or trigger.
- **Booking cancellation** — let users cancel `pending` bookings (add a `cancelled` status; add RLS update policy scoped to `pending` status).
- **Duplicate booking guard on the frontend** — before opening the confirm dialog, check if the user already has an approved/pending booking on the same date.
- **Loading & error states** — skeleton loaders for slot grid, toast notifications for booking outcomes.
- **Mobile responsiveness** — test slot grid on small screens; convert to a scrollable list if needed.
- **Admin: court creation UI** — form to add new courts and their recurring slots.

---

## Dependency Map (what blocks what)

```
Phase 0 (scaffold + Vercel)
  └── Phase 1 (DB schema)
        ├── Phase 2 (Auth)           ← nothing else works without this
        │     └── Phase 3 (availability read)
        │           └── Phase 4 (booking create)
        │                 └── Phase 5 (user dashboard)
        │                 └── Phase 6 (admin dashboard)
        │                       └── Phase 7 (real-time)
        └── Phase 8 (production deploy) ← run after Phase 7
              └── Phase 9 (polish)
```

---

## Key Files to Create (reference)

```
src/
  lib/
    supabaseClient.js         # Supabase singleton
  context/
    AuthContext.jsx           # Auth state + role
  hooks/
    useCourts.js
    useAvailableSlots.js
    useMakeBooking.js
    useMyBookings.js
    useAllBookings.js         # admin only
  components/
    ProtectedRoute.jsx
    AdminRoute.jsx
    SlotGrid.jsx
    BookingCard.jsx
    StatusBadge.jsx
  pages/
    Login.jsx
    Signup.jsx
    Courts.jsx
    CourtDetail.jsx           # slot picker
    MyBookings.jsx
    admin/
      Dashboard.jsx
      CourtsManager.jsx
```
