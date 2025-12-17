import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function TheatersAdmin() {
  const [theaters, setTheaters] = useState([])
  const [form, setForm] = useState({ name: '', location: '', rows: 10, cols: 12 })

  const load = async () => { const { data } = await api.get('/theaters'); setTheaters(data) }
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (form._id) await api.put(`/theaters/${form._id}`, { ...form, totalSeats: form.rows * form.cols })
    else await api.post('/theaters', { ...form, totalSeats: form.rows * form.cols })
    setForm({ name: '', location: '', rows: 10, cols: 12 })
    load()
  }

  const edit = (t) => setForm(t)
  const del = async (id) => { await api.delete(`/theaters/${id}`); load() }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={save} className="bg-gray-900 p-4 rounded space-y-3">
        <h2 className="font-semibold">{form._id ? 'Edit' : 'Add'} Theater</h2>
        <input className="w-full bg-gray-800 rounded p-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="w-full bg-gray-800 rounded p-2" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" className="bg-gray-800 rounded p-2" placeholder="Rows" value={form.rows} onChange={e => setForm({ ...form, rows: Number(e.target.value) })} />
          <input type="number" className="bg-gray-800 rounded p-2" placeholder="Cols" value={form.cols} onChange={e => setForm({ ...form, cols: Number(e.target.value) })} />
        </div>
        <button className="px-3 py-2 rounded bg-accent-500">Save</button>
      </form>

      <div className="space-y-3">
        {theaters.map(t => (
          <div key={t._id} className="p-3 bg-gray-900 rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-gray-400 text-sm">{t.location} • {t.rows}x{t.cols}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(t)} className="px-3 py-2 rounded bg-gray-800">Edit</button>
              <button onClick={() => del(t._id)} className="px-3 py-2 rounded bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
