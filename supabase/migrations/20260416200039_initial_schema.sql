-- Phase 1.2: Create tables

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Courts table
create table public.courts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  sport text not null check (sport in ('badminton', 'squash', 'tennis')),
  is_active bool default true,
  created_at timestamptz default now()
);

-- Time Slots table
create table public.time_slots (
  id uuid default gen_random_uuid() primary key,
  court_id uuid references public.courts(id) on delete cascade not null,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0=Sun ... 6=Sat
  start_time time not null,
  end_time time not null
);

-- Bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  court_id uuid references public.courts(id) on delete cascade not null,
  slot_id uuid references public.time_slots(id) on delete cascade not null,
  booking_date date not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  created_at timestamptz default now(),
  unique (court_id, slot_id, booking_date)
);

-- Phase 1.1: Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.courts enable row level security;
alter table public.time_slots enable row level security;
alter table public.bookings enable row level security;

-- Phase 1.4: Create handle_new_user function and trigger
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

-- Phase 1.3: Seed initial data
-- Create some courts
insert into public.courts (name, sport) values
  ('Badminton Court 1', 'badminton'),
  ('Badminton Court 2', 'badminton'),
  ('Squash Court 1', 'squash'),
  ('Tennis Court 1', 'tennis');

-- Simple helper to seed slots for the courts (7 AM to 9 PM, daily)
-- This is a one-time seed for the initial setup.
do $$
declare
    court_rec record;
    dow int;
    h int;
begin
    for court_rec in select id from public.courts loop
        for dow in 0..6 loop
            for h in 7..20 loop
                insert into public.time_slots (court_id, day_of_week, start_time, end_time)
                values (
                    court_rec.id, 
                    dow, 
                    (h || ':00:00')::time, 
                    ((h + 1) || ':00:00')::time
                );
            end loop;
        end loop;
    end loop;
end $$;
