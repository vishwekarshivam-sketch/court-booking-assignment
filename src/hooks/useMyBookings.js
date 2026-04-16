import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const useMyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchMyBookings = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          court:courts(name, sport),
          slot:time_slots(start_time, end_time)
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false })

      if (error) setError(error)
      else setBookings(data)
      setLoading(false)
    }

    fetchMyBookings()
  }, [user])

  return { bookings, loading, error }
}
