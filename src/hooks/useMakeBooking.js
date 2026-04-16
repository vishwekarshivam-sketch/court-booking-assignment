import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const useMakeBooking = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const makeBooking = async ({ courtId, slotId, date }) => {
    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('You must be logged in to make a booking')

      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            court_id: courtId,
            slot_id: slotId,
            booking_date: date,
            status: 'pending',
          },
        ])
        .select()

      if (insertError) {
        // Handle double-booking (unique constraint violation)
        if (insertError.code === '23505') {
          throw new Error('This slot was just taken — please choose another.')
        }
        throw insertError
      }

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  return { makeBooking, loading, error }
}
