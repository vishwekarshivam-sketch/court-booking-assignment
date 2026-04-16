-- Phase 3.1: allow authenticated reads

create policy "Anyone can view courts"     on public.courts     for select using (true);
create policy "Anyone can view time_slots" on public.time_slots for select using (true);
create policy "Anyone can view bookings"   on public.bookings   for select using (true);
