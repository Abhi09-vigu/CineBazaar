import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

export default function Dashboard() {
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState('')
  const load = async () => {
    try {
      const { data } = await api.get('/bookings/me')
      setBookings(data)
    } catch (e) { setError('Failed to load') }
  }
  useEffect(() => { load() }, [])

  const cancel = async (id) => {
    try {
      await api.post(`/bookings/cancel/${id}`)
      await load()
    } catch (e) {
      alert(e?.response?.data?.message || 'Cannot cancel')
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200">{error}</div>}
        {!bookings ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 skeleton" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-400">No bookings yet.</div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b._id} className="p-4 bg-gray-900 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{b.show.movie.title} • {b.show.theater.name}</div>
                  <div className="text-gray-400 text-sm">Seats: {b.seats.join(', ')} • ₹{b.amount.toFixed(2)} • {b.status}</div>
                </div>
                {b.status === 'CONFIRMED' && <button onClick={() => cancel(b._id)} className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700">Cancel</button>}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
