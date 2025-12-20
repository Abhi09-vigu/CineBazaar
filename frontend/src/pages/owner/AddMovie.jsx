import { useState } from 'react'
import Navbar from '../../components/Navbar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import movieService from '../../services/movieService.js'

export default function AddMovie() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(120)
  const [genre, setGenre] = useState('')
  const [language, setLanguage] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [poster, setPoster] = useState(null)
  const [posterUrl, setPosterUrl] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setSubmitting(true)
      await movieService.create({ title, description, duration, genre, language, releaseDate, poster, posterUrl })
      alert('Movie submitted')
      setTitle(''); setDescription(''); setDuration(120); setGenre(''); setLanguage(''); setReleaseDate(''); setPoster(null); setPosterUrl('')
    } catch (e) {
      setError(e?.response?.data?.message || 'Submission failed. Note: backend may restrict movie creation to admins.')
    } finally { setSubmitting(false) }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Add Movie</h1>
        {user?.role !== 'OWNER' && (
          <div className="p-3 rounded bg-amber-900/30 border border-amber-700 text-amber-200 mb-4">Only owners should add movies.</div>
        )}
        <form onSubmit={submit} className="space-y-3">
          {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200">{error}</div>}
          <input className="w-full bg-gray-900 rounded p-3" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <textarea className="w-full bg-gray-900 rounded p-3" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className="bg-gray-900 rounded p-3" placeholder="Genre" value={genre} onChange={(e)=>setGenre(e.target.value)} />
            <input className="bg-gray-900 rounded p-3" placeholder="Language" value={language} onChange={(e)=>setLanguage(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" min={1} className="bg-gray-900 rounded p-3" placeholder="Duration (mins)" value={duration} onChange={(e)=>setDuration(e.target.value)} />
            <input type="date" className="bg-gray-900 rounded p-3" value={releaseDate} onChange={(e)=>setReleaseDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="file" accept="image/*" className="bg-gray-900 rounded p-3" onChange={(e)=>setPoster(e.target.files?.[0] || null)} />
            <input className="bg-gray-900 rounded p-3" placeholder="Poster URL (optional if uploading)" value={posterUrl} onChange={(e)=>setPosterUrl(e.target.value)} />
          </div>
          <button disabled={submitting} className="px-4 py-2 rounded bg-accent-500 hover:bg-accent-600 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit'}</button>
        </form>
      </main>
    </>
  )
}
