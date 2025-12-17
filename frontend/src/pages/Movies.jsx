import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/movies', { params: { q } })
    setMovies(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <input value={q} onChange={(e) => setQ(e.target.value)} className="bg-gray-900 rounded p-3 flex-1" placeholder="Search movies..." />
          <button onClick={load} className="px-4 py-3 rounded bg-accent-500 hover:bg-accent-600">Search</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {loading && Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-64 skeleton" />)}
          {!loading && movies.map((m) => (
            <Link key={m._id} to={`/movies/${m._id}`} className="bg-gray-900 rounded overflow-hidden">
              <div className="aspect-[2/3] bg-gray-800" style={{ backgroundImage: `url(${m.posterUrl})`, backgroundSize: 'cover' }} />
              <div className="p-3">
                <h3 className="font-semibold line-clamp-1">{m.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{m.genre} • {m.language}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
