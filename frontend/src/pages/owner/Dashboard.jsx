import Navbar from '../../components/Navbar.jsx'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function OwnerDashboard() {
  const { user } = useAuth()
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        {!user?.ownerApproved ? (
          <div className="p-4 rounded bg-amber-900/30 border border-amber-700 text-amber-200">
            Your owner account is pending admin approval. You will be able to register theaters once approved.
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-300">Welcome, {user?.name}. You can register a new theater below.</p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/owner/theaters/new" className="inline-block px-4 py-2 rounded bg-accent-500 hover:bg-accent-600">Register Theater</Link>
              <Link to="/owner/theaters" className="inline-block px-4 py-2 rounded bg-gray-900 hover:bg-gray-800">Manage Theaters</Link>
              <Link to="/owner/movies/new" className="inline-block px-4 py-2 rounded bg-gray-900 hover:bg-gray-800">Add Movie</Link>
              <Link to="/owner/shows" className="inline-block px-4 py-2 rounded bg-gray-900 hover:bg-gray-800">Schedule Shows</Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
