import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useAdminCourts = () => {
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCourts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .order('sport')
      .order('name')

    if (error) setError(error)
    else setCourts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchCourts() }, [])

  const toggleActive = async (courtId, currentValue) => {
    const { error } = await supabase
      .from('courts')
      .update({ is_active: !currentValue })
      .eq('id', courtId)

    if (error) return { error }
    setCourts(prev => prev.map(c => c.id === courtId ? { ...c, is_active: !currentValue } : c))
    return { error: null }
  }

  return { courts, loading, error, toggleActive, refresh: fetchCourts }
}
