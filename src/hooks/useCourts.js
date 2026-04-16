import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useCourts = (sport = null) => {
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true)
      let query = supabase
        .from('courts')
        .select('*')
        .eq('is_active', true)

      if (sport) {
        query = query.eq('sport', sport)
      }

      const { data, error } = await query

      if (error) setError(error)
      else setCourts(data)
      setLoading(false)
    }

    fetchCourts()
  }, [sport])

  return { courts, loading, error }
}
