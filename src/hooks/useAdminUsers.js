import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useAdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .order('created_at', { ascending: false })

    if (error) setError(error)
    else setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) return { error }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    return { error: null }
  }

  return { users, loading, error, toggleRole, refresh: fetchUsers }
}
