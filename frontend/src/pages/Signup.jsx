import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const nav = useNavigate()
  const { signup } = useAuth()
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
      await signup(name, email, password)
      nav('/')
    } catch (e) {
      setError(e?.response?.data?.message || 'Signup failed')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Create account</h1>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200">{error}</div>}
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-accent-500 hover:bg-accent-600 text-white rounded p-3">{loading ? 'Creating...' : 'Sign up'}</button>
        </form>
        <p className="text-sm text-gray-400 mt-3">Have an account? <Link to="/login" className="text-accent-400">Login</Link></p>
      </main>
    </>
  )
}
