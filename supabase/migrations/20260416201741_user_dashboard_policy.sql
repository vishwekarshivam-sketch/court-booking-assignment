-- Phase 5.1: users can read only their own bookings
-- We already have a general select policy from Phase 3, but let's make it more specific for the dashboard
-- Actually, the Phase 3 policy was "true", which means public.
-- Let's drop that and add this specific one for privacy.

DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;

CREATE POLICY "Users see own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);
