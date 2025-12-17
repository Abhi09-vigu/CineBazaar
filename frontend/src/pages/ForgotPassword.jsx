import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [devToken, setDevToken] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setDevToken('')
    try {
      const { data } = await api.post('/auth/forgot', { email })
      setMessage('If that email exists, reset instructions were sent.')
      if (data?.token) setDevToken(data.token)
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Failed to initiate reset')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Forgot password</h1>
        <form onSubmit={submit} className="space-y-4">
          {message && <div className="p-3 bg-gray-900 rounded border border-gray-700">{message}</div>}
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button disabled={loading || !email} className="w-full bg-accent-500 hover:bg-accent-600 text-white rounded p-3">{loading ? 'Sending…' : 'Send reset link'}</button>
        </form>
        {devToken && (
          <div className="mt-4 text-sm text-gray-400">
            Dev token received. Use this link to reset:
            <div className="mt-1">
              <Link className="text-accent-400" to={`/reset?token=${devToken}`}>Open reset page</Link>
            </div>
          </div>
        )}
        <div className="mt-6 text-sm text-gray-400">
          Remembered your password? <Link to="/login" className="text-accent-400">Back to login</Link>
        </div>
      </main>
    </>
  )
}
