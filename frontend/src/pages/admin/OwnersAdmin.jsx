import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'

export default function OwnersAdmin() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/admin/owners/pending')
      setPending(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load pending owners')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const approve = async (id) => {
    try {
      await api.post(`/admin/owners/${id}/approve`)
      setPending((prev) => prev.filter(u => u._id !== id))
    } catch (e) {
      alert(e?.response?.data?.message || 'Approve failed')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Owner Approvals</h1>
        <button onClick={load} className="px-3 py-1.5 rounded bg-gray-900 hover:bg-gray-800">Refresh</button>
      </div>
      {error && <div className="p-3 bg-red-900/40 border border-red-700 rounded text-red-200 mb-3">{error}</div>}
      {loading ? (
        <div className="h-32 skeleton" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-gray-500">No pending owners.</td></tr>
              )}
              {pending.map(u => (
                <tr key={u._id} className="border-b border-gray-900/60">
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{new Date(u.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-4">
                    <button onClick={() => approve(u._id)} className="px-3 py-1.5 rounded bg-accent-500 hover:bg-accent-600">Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}
