import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error("AuthContext: Profile error", err)
    }
  }

  useEffect(() => {
    let settled = false

    const settle = () => {
      if (!settled) {
        settled = true
        setLoading(false)
      }
    }

    // Fallback: if onAuthStateChange never fires, unblock after 3s
    const timer = setTimeout(settle, 3000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
        // Unblock routing immediately — profile loads async in background
        clearTimeout(timer)
        settle()
        setProfileLoading(true)
        fetchProfile(session.user.id).finally(() => setProfileLoading(false))
      } else {
        setUser(null)
        setProfile(null)
        clearTimeout(timer)
        settle()
      }
    })

    return () => {
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = (email, password, fullName) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
  }

  const signIn = (email, password) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = () => {
    return supabase.auth.signOut()
  }

  const value = {
    user,
    profile,
    signUp,
    signIn,
    signOut,
    loading,
    profileLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#f8f9fa',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e0e0e0',
            borderTop: '3px solid #1D7A4A',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>Loading…</span>
        </div>
      ) : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
