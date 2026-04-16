import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getDay } from 'date-fns'

export const useAvailableSlots = (courtId, date) => {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!courtId || !date) return

    const fetchAvailability = async () => {
      setLoading(true)
      const dayOfWeek = getDay(new Date(date))

      // 1. Fetch all slots for this court and day_of_week
      const { data: allSlots, error: slotsError } = await supabase
        .from('time_slots')
        .select('*')
        .eq('court_id', courtId)
        .eq('day_of_week', dayOfWeek)
        .order('start_time')

      if (slotsError) {
        setError(slotsError)
        setLoading(false)
        return
      }

      // 2. Fetch all bookings for this court and date (excluding rejected ones)
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('slot_id, status')
        .eq('court_id', courtId)
        .eq('booking_date', date)
        .neq('status', 'rejected')

      if (bookingsError) {
        setError(bookingsError)
        setLoading(false)
        return
      }

      // 3. Map slots to include availability
      const bookedSlotIds = new Set(bookings.map((b) => b.slot_id))
      const slotsWithAvailability = allSlots.map((slot) => ({
        ...slot,
        is_available: !bookedSlotIds.has(slot.id),
      }))

      setSlots(slotsWithAvailability)
      setLoading(false)
    }

    fetchAvailability()

    // Phase 7: Real-time subscription
    const channel = supabase
      .channel(`court-availability-${courtId}-${date}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `court_id=eq.${courtId}`
        },
        (payload) => {
          // If the change affects our specific date, refresh
          if (payload.new && payload.new.booking_date === date) {
            fetchAvailability()
          } else if (payload.old && payload.old.booking_date === date) {
            fetchAvailability()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [courtId, date])

  return { slots, loading, error }
}
