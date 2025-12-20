import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import api from '../../services/api'

const letter = (i) => String.fromCharCode(65 + i)

export default function EditTheater() {
  const { id } = useParams()
  const [theater, setTheater] = useState(null)
  const [grid, setGrid] = useState([]) // array of arrays of strings ('' for space, seat label for seat)
  const [rows, setRows] = useState(0)
  const [cols, setCols] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/theaters')
        const t = data.find(x => x._id === id)
        if (!t) { setError('Theater not found'); return }
        setTheater(t)
        const layout = Array.isArray(t.layout) && t.layout.length ? t.layout.map(r => r.seats) : null
        const r = layout ? layout.length : t.rows
        const c = layout ? Math.max(1, ...layout.map(row => row.length)) : t.cols
        setRows(r); setCols(c)
        // initialize grid
        if (layout) {
          setGrid(layout.map(row => row.map(s => (s ?? '').trim())))
        } else {
          setGrid(Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => `${letter(i)}${j + 1}`)))
        }
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load theater')
      }
    }
    load()
  }, [id])

  const toggle = (ri, ci) => {
    setGrid(prev => prev.map((row, r) => row.map((s, c) => {
      if (r !== ri || c !== ci) return s
      return s ? '' : `${letter(r)}${c + 1}`
    })))
  }

  const autoLabelRow = (row, rIndex) => {
    let count = 0
    return row.map((s, c) => {
      if (s === '') return ''
      count += 1
      return `${letter(rIndex)}${count}`
    })
  }

  const autoLabelAll = () => {
    setGrid(prev => prev.map((row, r) => autoLabelRow(row, r)))
  }

  const addRow = () => {
    setGrid(prev => [...prev, Array.from({ length: cols }, (_, c) => `${letter(prev.length)}${c + 1}`)])
    setRows(prev => prev + 1)
  }

  const addCol = () => {
    setGrid(prev => prev.map((row, r) => [...row, `${letter(r)}${row.length + 1}`]))
    setCols(prev => prev + 1)
  }

  const save = async () => {
    setError('')
    setSaving(true)
    try {
      const layout = grid.map(row => ({ seats: row }))
      await api.put(`/theaters/${id}`, { layout })
      alert('Layout saved')
    } catch (e) {
      setError(e?.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const disabled = useMemo(() => saving || !theater, [saving, theater])

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {!theater ? (
          <div className="h-32 skeleton" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Edit Seating: {theater.name}</h1>
              <div className="flex items-center gap-2">
                <button onClick={autoLabelAll} className="px-3 py-1.5 rounded bg-gray-900 hover:bg-gray-800">Auto-label</button>
                <button onClick={addRow} className="px-3 py-1.5 rounded bg-gray-900 hover:bg-gray-800">Add Row</button>
                <button onClick={addCol} className="px-3 py-1.5 rounded bg-gray-900 hover:bg-gray-800">Add Column</button>
                <button disabled={disabled} onClick={save} className="px-3 py-1.5 rounded bg-accent-500 hover:bg-accent-600 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
            {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200">{error}</div>}
            <div className="space-y-2">
              {grid.map((row, ri) => (
                <div key={ri} className="flex justify-center gap-2">
                  {row.map((s, ci) => (
                    s ? (
                      <button key={`${ri}-${ci}`} onClick={() => toggle(ri, ci)}
                        className="w-10 h-10 text-xs rounded flex items-center justify-center border bg-gray-900 border-gray-700 hover:bg-gray-800">{s}</button>
                    ) : (
                      <button key={`${ri}-${ci}`} onClick={() => toggle(ri, ci)}
                        className="w-10 h-10 rounded border border-gray-800 bg-transparent" />
                    )
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
