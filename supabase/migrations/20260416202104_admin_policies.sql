-- Phase 6.2: Admins can read all bookings and update status

create policy "Admins read all bookings" on public.bookings
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins update booking status" on public.bookings
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
