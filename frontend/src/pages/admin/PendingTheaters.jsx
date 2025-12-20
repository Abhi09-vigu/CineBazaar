import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function PendingTheaters() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/admin/theaters/pending')
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load pending theaters')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const approve = async (id) => {
    try {
      await api.post(`/theaters/${id}/approve`)
      setItems(prev => prev.filter(t => t._id !== id))
    } catch (e) {
      alert(e?.response?.data?.message || 'Approve failed')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Pending Theaters</h1>
        <button onClick={load} className="px-3 py-1.5 rounded bg-gray-900 hover:bg-gray-800">Refresh</button>
      </div>
      {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200 mb-3">{error}</div>}
      {loading ? (
        <div className="h-32 skeleton" />
      ) : items.length === 0 ? (
        <div className="text-gray-500">No pending theaters.</div>
      ) : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t._id} className="p-4 bg-gray-900 rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.name} • {t.location}</div>
                <div className="text-sm text-gray-400">Rows: {t.rows}, Cols: {t.cols} • Total seats: {t.totalSeats}</div>
              </div>
              <button onClick={() => approve(t._id)} className="px-3 py-1.5 rounded bg-accent-500 hover:bg-accent-600">Approve</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
