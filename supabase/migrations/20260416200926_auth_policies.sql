-- Phase 2.5: RLS policies for profiles

-- Users can read and update only their own profile
create policy "Own profile" on public.profiles
  for all using (auth.uid() = id);
