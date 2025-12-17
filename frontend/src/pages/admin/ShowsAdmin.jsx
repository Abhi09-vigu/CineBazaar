import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ShowsAdmin() {
  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [theaters, setTheaters] = useState([])
  const [locations, setLocations] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('')
  // source toggle + catalog support
  const [source, setSource] = useState('existing') // 'existing' | 'catalog'
  const [catalog, setCatalog] = useState([])
  const [theaterOption, setTheaterOption] = useState('') // 'db::<id>' or 'cat::<name>::<city>'
  const [form, setForm] = useState({ movie: '', theater: '', date: '', time: '', seatPrice: 250 })

  const load = async () => {
    const [{ data: s }, { data: m }, { data: t }, { data: cat }] = await Promise.all([
      api.get('/shows'),
      api.get('/movies'),
      api.get('/theaters'),
      api.get('/theater-catalog', { params: { limit: 500 } })
    ])
    setShows(s); setMovies(m); setTheaters(t); setCatalog(cat)
    // prefer existing if present; otherwise catalog
    const initialSource = t.length > 0 ? 'existing' : 'catalog'
    setSource(initialSource)
    const locsExisting = Array.from(new Set(t.map(x => x.location).filter(Boolean))).sort()
    const locsCatalog = Array.from(new Set(cat.map(x => x.city))).sort()
    setLocations(initialSource === 'existing' ? locsExisting : locsCatalog)
  }
  useEffect(() => { load() }, [])

  // recompute locations when source changes
  useEffect(() => {
    const locsExisting = Array.from(new Set(theaters.map(x => x.location).filter(Boolean))).sort()
    const locsCatalog = Array.from(new Set(catalog.map(x => x.city))).sort()
    setLocations(source === 'existing' ? locsExisting : locsCatalog)
    setSelectedLocation('')
    setTheaterOption('')
    setForm({ ...form, theater: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source])

  const save = async (e) => {
    e.preventDefault()
    if (form._id) {
      await api.put(`/shows/${form._id}`, form)
    } else {
      let theaterId = form.theater
      // If using catalog selection, import on the fly
      if (source === 'catalog' && theaterOption.startsWith('cat::')) {
        const parts = theaterOption.replace('cat::', '').split('::')
        const name = parts[0]
        const city = parts[1]
        const { data: created } = await api.post('/theaters/import-catalog', {
          name, city, rows: 10, cols: 12
        })
        theaterId = created._id
      }
      await api.post('/shows', { ...form, theater: theaterId })
    }
    setForm({ movie: '', theater: '', date: '', time: '', seatPrice: 250 })
    setTheaterOption('')
    load()
  }

  const edit = (s) => setForm({ ...s, movie: s.movie._id, theater: s.theater._id, date: s.date?.slice(0, 10) })
  const del = async (id) => { await api.delete(`/shows/${id}`); load() }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={save} className="bg-gray-900 p-4 rounded space-y-3">
        <h2 className="font-semibold">{form._id ? 'Edit' : 'Add'} Show</h2>
        <select className="w-full bg-gray-800 rounded p-2" value={form.movie} onChange={e => setForm({ ...form, movie: e.target.value })}>
          <option value="">Select movie</option>
          {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
        </select>
        {/* Source toggle */}
        <div className="grid grid-cols-2 gap-2">
          <select className="bg-gray-800 rounded p-2" value={source} onChange={e => setSource(e.target.value)}>
            <option value="existing">Existing theaters</option>
            <option value="catalog">Catalog</option>
          </select>
          <div />
        </div>

        {/* Location picker based on source */}
        <select className="w-full bg-gray-800 rounded p-2" value={selectedLocation} onChange={e => { setSelectedLocation(e.target.value); setForm({ ...form, theater: '' }) }}>
          <option value="">Select location</option>
          {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        {source === 'existing' ? (
          <select className="w-full bg-gray-800 rounded p-2" value={form.theater} onChange={e => setForm({ ...form, theater: e.target.value })} disabled={!selectedLocation}>
            <option value="">Select theater</option>
            {theaters
              .filter(t => !selectedLocation || t.location === selectedLocation)
              .map(t => (
                <option key={t._id} value={t._id}>{t.name}{t.location ? ` • ${t.location}` : ''}</option>
              ))}
          </select>
        ) : (
          <select className="w-full bg-gray-800 rounded p-2" value={theaterOption} onChange={e => setTheaterOption(e.target.value)} disabled={!selectedLocation}>
            <option value="">Select theater</option>
            {catalog
              .filter(c => !selectedLocation || c.city === selectedLocation)
              .map(c => (
                <option key={`${c.name}-${c.city}`} value={`cat::${c.name}::${c.city}`}>{c.name}{c.area ? ` • ${c.area}` : ''}</option>
              ))}
          </select>
        )}
        <div className="grid grid-cols-2 gap-2">
          <input type="date" className="bg-gray-800 rounded p-2" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <input type="time" className="bg-gray-800 rounded p-2" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
        </div>
        <input type="number" className="bg-gray-800 rounded p-2" placeholder="Seat Price" value={form.seatPrice} onChange={e => setForm({ ...form, seatPrice: Number(e.target.value) })} />
        <button className="px-3 py-2 rounded bg-accent-500">Save</button>
      </form>

      <div className="space-y-3">
        {shows.map(s => (
          <div key={s._id} className="p-3 bg-gray-900 rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.movie.title} • {s.theater.name}</div>
              <div className="text-gray-400 text-sm">{s.date?.slice(0,10)} • {s.time} • ₹{s.seatPrice}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(s)} className="px-3 py-2 rounded bg-gray-800">Edit</button>
              <button onClick={() => del(s._id)} className="px-3 py-2 rounded bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
