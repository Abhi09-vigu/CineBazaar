import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function MoviesAdmin() {
  const [movies, setMovies] = useState([])
  const [form, setForm] = useState({ title: '', description: '', duration: 120, genre: '', language: '', releaseDate: '', posterUrl: '' })

  const load = async () => { const { data } = await api.get('/movies'); setMovies(data) }
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (form._id) {
      await api.put(`/movies/${form._id}`, form)
    } else {
      // Create via ADMIN-only endpoint
      await api.post('/admin/movies', form)
    }
    setForm({ title: '', description: '', duration: 120, genre: '', language: '', releaseDate: '', posterUrl: '' })
    load()
  }

  const edit = (m) => setForm({ ...m, releaseDate: m.releaseDate?.slice(0, 10) })
  const del = async (id) => { await api.delete(`/movies/${id}`); load() }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={save} className="bg-gray-900 p-4 rounded space-y-3">
        <h2 className="font-semibold">{form._id ? 'Edit' : 'Add'} Movie</h2>
        <input className="w-full bg-gray-800 rounded p-2" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full bg-gray-800 rounded p-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <input className="bg-gray-800 rounded p-2" placeholder="Genre" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
          <input className="bg-gray-800 rounded p-2" placeholder="Language" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" className="bg-gray-800 rounded p-2" placeholder="Duration" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
          <input type="date" className="bg-gray-800 rounded p-2" placeholder="Release Date" value={form.releaseDate} onChange={e => setForm({ ...form, releaseDate: e.target.value })} />
        </div>
        <input className="w-full bg-gray-800 rounded p-2" placeholder="Poster URL" value={form.posterUrl} onChange={e => setForm({ ...form, posterUrl: e.target.value })} />
        <button className="px-3 py-2 rounded bg-accent-500">Save</button>
      </form>

      <div className="space-y-3">
        {movies.map(m => (
          <div key={m._id} className="p-3 bg-gray-900 rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{m.title}</div>
              <div className="text-gray-400 text-sm">{m.genre} • {m.language}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(m)} className="px-3 py-2 rounded bg-gray-800">Edit</button>
              <button onClick={() => del(m._id)} className="px-3 py-2 rounded bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
