import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useAllBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profile:profiles(full_name),
        court:courts(name, sport),
        slot:time_slots(start_time, end_time)
      `)
      .order('created_at', { ascending: false })

    if (error) setError(error)
    else setBookings(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()

    // Real-time updates (Phase 7 preview)
    const channel = supabase
      .channel('admin-bookings-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          fetchBookings()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const updateBookingStatus = async (bookingId, status) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    if (error) return { error }
    
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b))
    return { error: null }
  }

  return { bookings, loading, error, updateBookingStatus, refresh: fetchBookings }
}
