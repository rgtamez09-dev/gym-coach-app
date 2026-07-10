import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Workout from './pages/Workout'
import Progress from './pages/Progress'
import Exercises from './pages/Exercises'
import Home from './pages/Home'
import Program from './pages/Program'
import Nutrition from './pages/Nutrition'
import SetPassword from './pages/SetPassword'

function Loader() {
  return (
    <div className="min-h-screen bg-[var(--color-gym-bg)] flex items-center justify-center">
      <p className="text-[var(--color-gym-muted)]">Cargando...</p>
    </div>
  )
}

function AuthGuard({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        useAuthStore.getState().refreshSession()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [initialize])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/workout"
          element={
            <AuthGuard>
              <Workout />
            </AuthGuard>
          }
        />
        <Route path="/exercises" element={<AuthGuard><Exercises /></AuthGuard>} />
        <Route path="/progress" element={<AuthGuard><Progress /></AuthGuard>} />
        <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
        <Route path="/program" element={<AuthGuard><Program /></AuthGuard>} />
        <Route path="/nutrition" element={<AuthGuard><Nutrition /></AuthGuard>} />
        <Route path="/set-password" element={<AuthGuard><SetPassword /></AuthGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
