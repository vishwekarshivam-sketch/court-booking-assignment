-- Phase 4.1: users can insert their own bookings
create policy "Users can create bookings" on public.bookings
  for insert with check (auth.uid() = user_id);
