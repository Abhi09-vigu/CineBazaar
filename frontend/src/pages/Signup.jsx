import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const nav = useNavigate()
  const { signup, signupOwner } = useAuth()
  const [sp] = useSearchParams()
  const ownerMode = useMemo(() => sp.get('owner') === '1', [sp])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (ownerMode) {
        await signupOwner(name, email, password)
        // Owner needs approval; send to owner login page to show status
        nav('/login?owner=1')
      } else {
        await signup(name, email, password)
        nav('/')
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Signup failed')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">{ownerMode ? 'Create owner account' : 'Create account'}</h1>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200">{error}</div>}
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-accent-500 hover:bg-accent-600 text-white rounded p-3">{loading ? 'Creating...' : 'Sign up'}</button>
        </form>
        <p className="text-sm text-gray-400 mt-3 flex items-center gap-3">
          <span>Have an account?</span>
          <Link to={ownerMode ? '/login?owner=1' : '/login'} className="text-accent-400">Login</Link>
          <span className="text-gray-600">|</span>
          {ownerMode ? (
            <Link to="/signup" className="text-accent-400">User signup</Link>
          ) : (
            <Link to="/signup?owner=1" className="text-accent-400">Owner signup</Link>
          )}
        </p>
        {ownerMode && (
          <div className="mt-3 text-xs text-amber-300/90">
            Note: Your owner account requires admin approval before you can register theaters.
          </div>
        )}
      </main>
    </>
  )
}
