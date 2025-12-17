import { NavLink } from 'react-router-dom'

const item = (to, label) => (
  <NavLink to={to} end className={({ isActive }) => `block px-4 py-2 rounded hover:bg-gray-800 ${isActive ? 'bg-gray-900 text-accent-400' : 'text-gray-300'}`}>{label}</NavLink>
)

export default function AdminSidebar() {
  return (
    <aside className="w-60 border-r border-gray-800 p-4 hidden md:block">
      <div className="text-xl font-semibold text-accent-500 mb-4">Admin</div>
      <nav className="space-y-1">
        {item('/admin', 'Dashboard')}
        {item('/admin/add-movie', 'Add Movie')}
        {item('/admin/manage-movies', 'Manage Movies')}
        {item('/admin/shows', 'Manage Shows')}
        {item('/admin/bookings', 'Bookings')}
      </nav>
    </aside>
  )
}
