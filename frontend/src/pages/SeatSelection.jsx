import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

const seatId = (r, c) => `${String.fromCharCode(65 + r)}${c + 1}`

export default function SeatSelection() {
  const { showId } = useParams()
  const nav = useNavigate()
  const [show, setShow] = useState(null)
  const [selected, setSelected] = useState([])
  const [locking, setLocking] = useState(false)

  useEffect(() => { api.get(`/shows/${showId}`).then(({ data }) => setShow(data)) }, [showId])

  const grid = useMemo(() => {
    if (!show) return []
    return Array.from({ length: show.rows }, (_, r) => Array.from({ length: show.cols }, (_, c) => seatId(r, c)))
  }, [show])

  const isBooked = (s) => show?.bookedSeats?.includes(s)

  const toggle = (s) => {
    if (isBooked(s)) return
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const proceed = async () => {
    if (!selected.length) return
    setLocking(true)
    try {
      await api.post('/bookings/lock', { showId, seats: selected })
      nav(`/checkout/${showId}`, { state: { seats: selected, price: show.seatPrice } })
    } catch (e) {
      alert(e?.response?.data?.message || 'Lock failed')
    } finally { setLocking(false) }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!show ? <div className="h-48 skeleton" /> : (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Select Seats</h1>
              <div className="text-gray-400">{show.movie.title} • {show.theater.name}</div>
            </div>
            <div className="space-y-2">
              {grid.map((row, i) => (
                <div key={i} className="flex justify-center gap-2">
                  {row.map(s => (
                    <button key={s} onClick={() => toggle(s)}
                      className={`w-8 h-8 text-xs rounded flex items-center justify-center border
                        ${isBooked(s) ? 'bg-gray-700 border-gray-700 text-gray-500 cursor-not-allowed' : selected.includes(s) ? 'bg-accent-500 border-accent-500 text-white' : 'bg-gray-900 border-gray-700 hover:bg-gray-800'}`}>{s}</button>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-300">Selected: {selected.length} • Total: ₹{(selected.length * show.seatPrice).toFixed(2)}</div>
              <button disabled={locking || !selected.length} onClick={proceed} className="px-4 py-2 rounded bg-accent-500 hover:bg-accent-600 disabled:opacity-50">{locking ? 'Locking...' : 'Proceed'}</button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
