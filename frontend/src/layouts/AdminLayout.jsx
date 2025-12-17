import { Outlet, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AdminSidebar from '../components/AdminSidebar.jsx'
import AdminNavbar from '../components/AdminNavbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLayout() {
  const { user } = useAuth()
  const nav = useNavigate()
  if (!user || user.role !== 'ADMIN') {
    nav('/')
    return null
  }
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <AdminNavbar />
        <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
