import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ManageMovies() {
  const [movies, setMovies] = useState(null)

  const load = async () => {
    const { data } = await api.get('/movies')
    setMovies(data)
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-3">
      {!movies ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 skeleton" />)}</div>
      ) : (
        movies.map(m => (
          <div key={m._id} className="p-3 bg-gray-900 rounded flex items-center gap-4">
            <img src={m.posterUrl} alt="poster" className="w-16 h-20 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{m.title}</div>
              <div className="text-gray-400 text-sm">{m.genre} • {m.language}</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
