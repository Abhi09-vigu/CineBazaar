import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function OwnerRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login?owner=1" replace />
  if (user.role !== 'OWNER') return <Navigate to="/" replace />
  return children
}
