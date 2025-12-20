import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="border-b border-gray-800 sticky top-0 z-40 backdrop-blur bg-gray-950/70">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-accent-500">CineBazaar</Link>
        <nav className="flex items-center gap-4">
          <Link to="/movies" className="hover:text-accent-400">Movies</Link>
          {user && <Link to="/dashboard" className="hover:text-accent-400">Dashboard</Link>}
          {user?.role === 'OWNER' && <Link to="/owner" className="hover:text-accent-400">Owner</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin" className="hover:text-accent-400">Admin</Link>}
          {!user ? (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700">Login</Link>
              <Link to="/signup" className="px-3 py-1.5 rounded bg-accent-500 hover:bg-accent-600 text-white">Sign up</Link>
            </>
          ) : (
            <button onClick={logout} className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700">Logout</button>
          )}
        </nav>
      </div>
    </header>
  )
}
