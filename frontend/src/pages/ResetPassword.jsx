import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

export default function ResetPassword() {
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const token = useMemo(() => sp.get('token') || '', [sp])

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 6) return setMessage('Password must be at least 6 characters')
    if (password !== confirm) return setMessage('Passwords do not match')
    setLoading(true)
    setMessage('')
    try {
      await api.post('/auth/reset', { token, password })
      setMessage('Password reset successful. Redirecting to login…')
      setTimeout(() => nav('/login'), 800)
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Reset failed')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Reset password</h1>
        {!token && (
          <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200 mb-4">Missing token. Request a new link.</div>
        )}
        <form onSubmit={submit} className="space-y-4">
          {message && <div className="p-3 bg-gray-900 rounded border border-gray-700">{message}</div>}
          <input className="w-full bg-gray-900 rounded p-3" placeholder="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <button disabled={loading || !token} className="w-full bg-accent-500 hover:bg-accent-600 text-white rounded p-3">{loading ? 'Resetting…' : 'Reset password'}</button>
        </form>
        <div className="mt-6 text-sm text-gray-400">
          <Link to="/login" className="text-accent-400">Back to login</Link>
        </div>
      </main>
    </>
  )
}
