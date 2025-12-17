import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [shows, setShows] = useState([])

  useEffect(() => {
    api.get(`/movies/${id}`).then(({ data }) => setMovie(data))
    api.get('/shows', { params: { movie: id } }).then(({ data }) => setShows(data))
  }, [id])

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!movie ? (
          <div className="h-64 skeleton" />
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="aspect-[2/3] bg-gray-800 rounded" style={{ backgroundImage: `url(${movie.posterUrl})`, backgroundSize: 'cover' }} />
            </div>
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
              <p className="text-gray-300 mb-4">{movie.description}</p>
              <p className="text-gray-400 mb-6">{movie.genre} • {movie.language} • {movie.duration} mins</p>
              <h2 className="text-xl font-semibold mb-3">Shows</h2>
              <div className="space-y-3">
                {shows.map(s => (
                  <div key={s._id} className="p-4 bg-gray-900 rounded flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{s.theater.name} • {s.theater.location}</div>
                      <div className="text-gray-400 text-sm">{new Date(s.date).toDateString()} • {s.time}</div>
                    </div>
                    <Link to={`/book/${s._id}`} className="px-4 py-2 rounded bg-accent-500 hover:bg-accent-600">Book</Link>
                  </div>
                ))}
                {shows.length === 0 && <div className="text-gray-400">No shows scheduled.</div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
