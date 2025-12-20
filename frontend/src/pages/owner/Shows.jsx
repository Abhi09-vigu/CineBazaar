import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/Navbar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api'

export default function OwnerShows() {
  const { user } = useAuth()
  const [movies, setMovies] = useState([])
  const [theaters, setTheaters] = useState([])
  const [shows, setShows] = useState([])
  const [form, setForm] = useState({ movie: '', theater: '', date: '', time: '', seatPrice: 250 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const ownerTheaters = useMemo(() => theaters.filter(t => String(t.owner) === String(user?.id) && t.approved), [theaters, user])
  const ownerShows = useMemo(() => shows.filter(s => String(s?.theater?.owner) === String(user?.id)), [shows, user])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [{ data: m }, { data: t }, { data: s }] = await Promise.all([
        api.get('/movies'),
        api.get('/theaters'),
        api.get('/shows')
      ])
      setMovies(m); setTheaters(t); setShows(s)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load data')
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/shows', form)
      setForm({ movie: '', theater: '', date: '', time: '', seatPrice: 250 })
      load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create show')
    }
  }

  const del = async (id) => {
    if (!confirm('Delete this show?')) return
    await api.delete(`/shows/${id}`)
    load()
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Schedule Shows</h1>
        {!user?.ownerApproved && (
          <div className="p-3 mb-4 rounded bg-amber-900/30 border border-amber-700 text-amber-200">Your owner account is not yet approved.</div>
        )}
        {error && <div className="p-3 mb-4 rounded bg-red-900/40 border border-red-700 text-red-200">{error}</div>}

        <form onSubmit={save} className="bg-gray-900 p-4 rounded space-y-3 mb-6">
          <div className="grid md:grid-cols-2 gap-3">
            <select className="bg-gray-800 rounded p-2" value={form.movie} onChange={e => setForm({ ...form, movie: e.target.value })}>
              <option value="">Select movie</option>
              {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
            </select>
            <select className="bg-gray-800 rounded p-2" value={form.theater} onChange={e => setForm({ ...form, theater: e.target.value })}>
              <option value="">Select your theater</option>
              {ownerTheaters.map(t => <option key={t._id} value={t._id}>{t.name} • {t.location}</option>)}
            </select>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <input type="date" className="bg-gray-800 rounded p-2" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <input type="time" className="bg-gray-800 rounded p-2" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            <input type="number" min={0} className="bg-gray-800 rounded p-2" placeholder="Seat Price" value={form.seatPrice} onChange={e => setForm({ ...form, seatPrice: Number(e.target.value) })} />
          </div>
          <button className="px-4 py-2 rounded bg-accent-500 hover:bg-accent-600">Add Show</button>
        </form>

        {loading ? (
          <div className="h-40 skeleton" />
        ) : ownerShows.length === 0 ? (
          <div className="text-gray-400">No shows yet. Create your first one above.</div>
        ) : (
          <div className="space-y-3">
            {ownerShows.map(s => (
              <div key={s._id} className="p-4 bg-gray-900 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{s.movie.title} • {s.theater.name}</div>
                  <div className="text-gray-400 text-sm">{new Date(s.date).toDateString()} • {s.time} • ₹{s.seatPrice}</div>
                </div>
                <button onClick={() => del(s._id)} className="px-3 py-2 rounded bg-red-700">Delete</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
