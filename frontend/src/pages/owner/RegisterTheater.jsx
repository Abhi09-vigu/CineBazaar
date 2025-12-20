import { useMemo, useState } from 'react'
import Navbar from '../../components/Navbar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

export default function RegisterTheater() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [mode, setMode] = useState('grid') // 'grid' | 'layout'
  const [rows, setRows] = useState(10)
  const [cols, setCols] = useState(12)
  const [layoutText, setLayoutText] = useState('[{"seats":["A1","A2","","A3"]}]')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const disabled = useMemo(() => submitting || !user?.ownerApproved, [submitting, user])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!user?.ownerApproved) {
      setError('Your owner account is not approved yet.')
      return
    }
    try {
      setSubmitting(true)
      const payload = { name, location }
      if (mode === 'grid') {
        payload.rows = Number(rows)
        payload.cols = Number(cols)
      } else {
        try {
          const parsed = JSON.parse(layoutText)
          if (!Array.isArray(parsed)) throw new Error('Layout must be an array of rows')
          payload.layout = parsed
        } catch (e) {
          setError('Invalid layout JSON: ' + (e?.message || e))
          setSubmitting(false)
          return
        }
      }
      const { data } = await api.post('/theaters', payload)
      alert('Theater submitted. Waiting for admin approval.')
      nav('/owner')
    } catch (e) {
      setError(e?.response?.data?.message || 'Submission failed')
    } finally { setSubmitting(false) }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Register Theater</h1>
        {!user?.ownerApproved && (
          <div className="p-3 rounded bg-amber-900/30 border border-amber-700 text-amber-200 mb-4">Owner approval pending. You cannot submit yet.</div>
        )}
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200">{error}</div>}
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Theater name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Location (Area/City)" value={location} onChange={(e) => setLocation(e.target.value)} />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2"><input type="radio" checked={mode==='grid'} onChange={() => setMode('grid')} /> <span>Use rows/cols</span></label>
            <label className="flex items-center gap-2"><input type="radio" checked={mode==='layout'} onChange={() => setMode('layout')} /> <span>Provide layout JSON</span></label>
          </div>

          {mode==='grid' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400">Rows</label>
                <input type="number" min={1} className="w-full bg-gray-900 rounded p-3" value={rows} onChange={(e)=>setRows(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-400">Columns</label>
                <input type="number" min={1} className="w-full bg-gray-900 rounded p-3" value={cols} onChange={(e)=>setCols(e.target.value)} />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm text-gray-400">Layout JSON (array of rows: {`[{ seats: ["A1","A2","", "A3"] }]`})</label>
              <textarea className="w-full bg-gray-900 rounded p-3 h-40" value={layoutText} onChange={(e)=>setLayoutText(e.target.value)} />
              <p className="text-xs text-gray-500 mt-1">Empty string ("") denotes a space/aisle.</p>
            </div>
          )}

          <button disabled={disabled} className="px-4 py-2 rounded bg-accent-500 hover:bg-accent-600 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit for Approval'}</button>
        </form>
      </main>
    </>
  )
}
