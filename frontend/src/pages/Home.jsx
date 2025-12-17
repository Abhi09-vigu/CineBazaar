import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

export default function Home() {
  const [movies, setMovies] = useState(null)
  useEffect(() => { api.get('/movies').then(({ data }) => setMovies(data.slice(0, 8))) }, [])
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Now Showing</h1>
          <p className="text-gray-400">Book tickets for the latest movies</p>
        </section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {!movies && Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-64 skeleton" />)}
          {movies?.map((m, i) => (
            <motion.div key={m._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-gray-900 rounded shadow hover:shadow-accent-500/20 overflow-hidden">
              <Link to={`/movies/${m._id}`}>
                <div className="aspect-[2/3] bg-gray-800" style={{ backgroundImage: `url(${m.posterUrl})`, backgroundSize: 'cover' }} />
                <div className="p-3">
                  <h3 className="font-semibold line-clamp-1">{m.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{m.genre} • {m.language}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  )
}
