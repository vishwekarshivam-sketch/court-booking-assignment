import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, ChevronDown } from 'lucide-react'
import './Navbar.css'

type ActivePage = 'courts' | 'my-bookings' | 'admin' | ''

interface NavbarProps {
  activePage?: ActivePage
}

const Navbar: React.FC<NavbarProps> = ({ activePage = '' }) => {
  const { profile, user, signOut } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const name = profile?.full_name || 'User'
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase()
  const isAdmin = profile?.role === 'admin'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setDropdownOpen(false)
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="logo">
            COURT<span className="logo-accent">BOOK</span>
          </Link>
          <div className="nav-links">
            <Link to="/courts" className={`nav-link${activePage === 'courts' ? ' active' : ''}`}>
              Courts
            </Link>
            <Link to="/my-bookings" className={`nav-link${activePage === 'my-bookings' ? ' active' : ''}`}>
              My Bookings
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`nav-link${activePage === 'admin' ? ' active' : ''}`}>
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-right" ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className="navbar-user-btn"
            onClick={() => setDropdownOpen(o => !o)}
            aria-expanded={dropdownOpen}
          >
            {isAdmin && <span className="nav-admin-badge">Admin</span>}
            <span className="nav-name">{name}</span>
            <div className={`avatar${isAdmin ? ' avatar-primary' : ''}`}>{initials}</div>
            <ChevronDown
              width={12}
              height={12}
              style={{
                color: '#444',
                transition: 'transform 0.15s',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown__header">
                <div className={`avatar avatar-lg${isAdmin ? ' avatar-primary' : ''}`}>{initials}</div>
                <div className="user-dropdown__info">
                  <p className="user-dropdown__name">{name}</p>
                  <p className="user-dropdown__email">{user?.email}</p>
                </div>
              </div>
              <button className="user-dropdown__item user-dropdown__item--danger" onClick={handleSignOut}>
                <LogOut width={14} height={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
