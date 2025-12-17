import { useAuth } from '../context/AuthContext.jsx'

export default function AdminNavbar() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-gray-950/70 border-b border-gray-800"> 
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="font-semibold">CineWave Admin</div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-400">{user?.name}</span>
          <button onClick={logout} className="px-3 py-1.5 rounded bg-gray-900 hover:bg-gray-800">Logout</button>
        </div>
      </div>
    </header>
  )
}
