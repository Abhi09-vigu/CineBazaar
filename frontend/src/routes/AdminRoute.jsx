import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  // If not authenticated, send to login with admin mode hint
  if (!user) return <Navigate to="/login?admin=1" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}
