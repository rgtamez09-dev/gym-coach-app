import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Workout from './pages/Workout'

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
  }, [])

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
        {/* Placeholder routes — implemented in Session 3 & 4 */}
        <Route path="/program" element={<AuthGuard><div className="min-h-screen bg-[var(--color-gym-bg)] flex items-center justify-center text-[var(--color-gym-muted)]">Plan — Sesión 4</div></AuthGuard>} />
        <Route path="/exercises" element={<AuthGuard><div className="min-h-screen bg-[var(--color-gym-bg)] flex items-center justify-center text-[var(--color-gym-muted)]">Ejercicios — Sesión 3</div></AuthGuard>} />
        <Route path="/progress" element={<AuthGuard><div className="min-h-screen bg-[var(--color-gym-bg)] flex items-center justify-center text-[var(--color-gym-muted)]">Progreso — Sesión 3</div></AuthGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
