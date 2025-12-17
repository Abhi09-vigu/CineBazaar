import { Routes, Route, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import MoviesAdmin from './MoviesAdmin.jsx'
import TheatersAdmin from './TheatersAdmin.jsx'
import ShowsAdmin from './ShowsAdmin.jsx'
import Analytics from './Analytics.jsx'

export default function Admin() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <Link to="/admin" className="px-3 py-2 rounded bg-gray-900">Analytics</Link>
          <Link to="/admin/movies" className="px-3 py-2 rounded bg-gray-900">Movies</Link>
          <Link to="/admin/theaters" className="px-3 py-2 rounded bg-gray-900">Theaters</Link>
          <Link to="/admin/shows" className="px-3 py-2 rounded bg-gray-900">Shows</Link>
        </div>
        <Routes>
          <Route index element={<Analytics />} />
          <Route path="movies" element={<MoviesAdmin />} />
          <Route path="theaters" element={<TheatersAdmin />} />
          <Route path="shows" element={<ShowsAdmin />} />
        </Routes>
      </main>
    </>
  )
}
