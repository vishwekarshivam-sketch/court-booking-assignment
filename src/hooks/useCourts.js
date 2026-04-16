import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useCourts = (sport = null) => {
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchCourts = async () => {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('courts')
        .select('*')
        .eq('is_active', true)

      if (sport) {
        query = query.eq('sport', sport)
      }

      try {
        const { data, error } = await query
        if (cancelled) return
        if (error) {
          console.error('useCourts error:', error)
          setError(error.message || 'Failed to fetch courts')
        } else {
          setCourts(data ?? [])
        }
      } catch (err) {
        if (cancelled) return
        console.error('useCourts error:', err)
        setError(err.message || 'Failed to fetch courts')
      }
      if (!cancelled) setLoading(false)
    }

    fetchCourts()
    return () => { cancelled = true }
  }, [sport, retryCount])

  const retry = useCallback(() => setRetryCount(n => n + 1), [])

  return { courts, loading, error, retry }
}
