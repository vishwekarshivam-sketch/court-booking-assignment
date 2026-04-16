-- Phase 9: Users can cancel their own pending bookings
CREATE POLICY "Users can cancel own pending bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = user_id AND status = 'pending'
  )
  WITH CHECK (
    status = 'cancelled'
  );
