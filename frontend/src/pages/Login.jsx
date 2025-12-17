import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [sp] = useSearchParams()
  const adminMode = useMemo(() => sp.get('admin') === '1', [sp])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(email, password)
      // In admin mode, enforce admin role and redirect to /admin
      const stored = localStorage.getItem('user')
      const u = stored ? JSON.parse(stored) : null
      if (adminMode) {
        if (u?.role === 'ADMIN') nav('/admin')
        else setError('Admin access required. Please use an admin account.')
      } else {
        nav('/')
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">{adminMode ? 'Admin Login' : 'Login'}</h1>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200">{error}</div>}
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <button disabled={loading} className="w-full bg-accent-500 hover:bg-accent-600 text-white rounded p-3">{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        
        <div className="mt-3 text-sm text-gray-400 flex items-center justify-between">
          <p>No account? <Link to="/signup" className="text-accent-400">Sign up</Link></p>
          <div className="flex items-center gap-3">
            <Link to="/forgot" className="text-accent-400">Forgot password?</Link>
            <span className="text-gray-600">|</span>
            {adminMode ? (
              <Link to="/login" className="text-accent-400">User login</Link>
            ) : (
              <Link to="/login?admin=1" className="text-accent-400">Admin login</Link>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
