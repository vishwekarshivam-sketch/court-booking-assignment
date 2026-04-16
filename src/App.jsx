import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/RouteGuards'

// Pages
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import CourtsPage from './pages/CourtsPage'
import CourtDetail from './pages/CourtDetail'
import MyBookings from './pages/MyBookings'
import AdminDashboard from './pages/admin/AdminDashboard'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected User Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/courts" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courts" 
            element={
              <ProtectedRoute>
                <CourtsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courts/:courtId" 
            element={
              <ProtectedRoute>
                <CourtDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
