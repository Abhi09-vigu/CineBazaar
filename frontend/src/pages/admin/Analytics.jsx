import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    // Simple derived analytics using available endpoints
    Promise.all([api.get('/bookings/me'), api.get('/movies'), api.get('/shows')]).then(([b, m, s]) => {
      const revenue = b.data.reduce((sum, x) => sum + (x.status === 'CONFIRMED' ? x.amount : 0), 0)
      setStats({ myRevenue: revenue, movies: m.data.length, shows: s.data.length })
    })
  }, [])

  if (!stats) return <div className="h-24 skeleton" />

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="bg-gray-900 p-4 rounded">
        <div className="text-gray-400 text-sm">My Revenue</div>
        <div className="text-2xl font-bold">₹{stats.myRevenue.toFixed(2)}</div>
      </div>
      <div className="bg-gray-900 p-4 rounded">
        <div className="text-gray-400 text-sm">Movies</div>
        <div className="text-2xl font-bold">{stats.movies}</div>
      </div>
      <div className="bg-gray-900 p-4 rounded">
        <div className="text-gray-400 text-sm">Shows</div>
        <div className="text-2xl font-bold">{stats.shows}</div>
      </div>
    </div>
  )
}
