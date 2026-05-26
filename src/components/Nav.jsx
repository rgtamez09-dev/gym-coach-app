import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/workout', label: 'Sesión', icon: '💪' },
  { to: '/home', label: 'Casa', icon: '🏡' },
  { to: '/exercises', label: 'Ejerc.', icon: '📖' },
  { to: '/progress', label: 'Progreso', icon: '📈' },
  { to: '/program', label: 'Plan', icon: '📅' },
]

export default function Nav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-gym-surface)] border-t border-[var(--color-gym-border)]">
      <div className="max-w-lg mx-auto flex">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 text-[10px] transition-colors ${
                isActive
                  ? 'text-[var(--color-gym-accent)]'
                  : 'text-[var(--color-gym-muted)] hover:text-[var(--color-gym-text)]'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span className="mt-0.5">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
