import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar.jsx'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function Theaters() {
  const [theaters, setTheaters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/theaters')
      setTheaters(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load theaters')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Theaters</h1>
          <Link to="/owner/theaters/new" className="px-3 py-1.5 rounded bg-accent-500 hover:bg-accent-600">Register New</Link>
        </div>
        {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200 mb-3">{error}</div>}
        {loading ? (
          <div className="h-32 skeleton" />
        ) : (
          <div className="space-y-3">
            {theaters.filter(t => t.owner).map(t => (
              <div key={t._id} className="p-4 bg-gray-900 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{t.name} • {t.location}</div>
                  <div className="text-sm text-gray-400">Rows: {t.rows}, Cols: {t.cols} • Total seats: {t.totalSeats}</div>
                  {!t.approved && <div className="text-xs text-amber-300">Pending admin approval</div>}
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/owner/theaters/${t._id}/edit`} className="px-3 py-1.5 rounded bg-gray-900 hover:bg-gray-800">Edit Layout</Link>
                </div>
              </div>
            ))}
            {theaters.filter(t => t.owner).length === 0 && (
              <div className="text-gray-400">You have no theaters yet.</div>
            )}
          </div>
        )}
      </main>
    </>
  )
}
