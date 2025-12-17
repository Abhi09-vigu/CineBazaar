import { useState } from 'react'
import movieService from '../../services/movieService'

export default function AddMovie() {
  const [form, setForm] = useState({ title: '', description: '', duration: 120, genre: '', language: '', releaseDate: '' })
  const [poster, setPoster] = useState(null)
  const [posterUrl, setPosterUrl] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const onPoster = (e) => {
    const f = e.target.files?.[0]
    setPoster(f || null)
    setPreview(f ? URL.createObjectURL(f) : '')
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await movieService.create({ ...form, poster, posterUrl })
      setMessage('Movie created successfully')
      setForm({ title: '', description: '', duration: 120, genre: '', language: '', releaseDate: '' })
      setPoster(null); setPreview(''); setPosterUrl('')
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Failed to create movie')
    } finally { setLoading(false) }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form onSubmit={submit} className="bg-gray-900 p-4 rounded space-y-3 md:col-span-2">
        <h2 className="font-semibold">Add Movie</h2>
        {message && <div className="p-3 bg-gray-800 rounded border border-gray-700">{message}</div>}
        <input className="w-full bg-gray-800 rounded p-2" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <textarea className="w-full bg-gray-800 rounded p-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        <div className="grid grid-cols-2 gap-2">
          <input className="bg-gray-800 rounded p-2" placeholder="Genre" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} required />
          <input className="bg-gray-800 rounded p-2" placeholder="Language" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} required />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" className="bg-gray-800 rounded p-2" placeholder="Duration" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} required />
          <input type="date" className="bg-gray-800 rounded p-2" value={form.releaseDate} onChange={e => setForm({ ...form, releaseDate: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Poster File</label>
          <input type="file" accept="image/*" onChange={onPoster} className="block w-full text-sm" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">or Poster URL</label>
          <input className="w-full bg-gray-800 rounded p-2" placeholder="https://..." value={posterUrl} onChange={e => setPosterUrl(e.target.value)} />
        </div>
        <button disabled={loading || (!poster && !posterUrl)} className="px-3 py-2 rounded bg-accent-500 disabled:opacity-50">{loading ? 'Uploading…' : 'Create Movie'}</button>
      </form>
      <div>
        <div className="bg-gray-900 p-4 rounded">
          <div className="text-sm text-gray-400 mb-2">Preview</div>
          {preview ? <img src={preview} alt="preview" className="rounded" /> : <div className="h-64 skeleton" />}
        </div>
      </div>
    </div>
  )
}

