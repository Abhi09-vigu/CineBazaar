import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Movies from './pages/Movies.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import ShowDetails from './pages/ShowDetails.jsx'
import SeatSelection from './pages/SeatSelection.jsx'
import Checkout from './pages/Checkout.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import AdminRoute from './routes/AdminRoute.jsx'
// Admin pages cleaned up; only Owner Approvals remain
import OwnersAdmin from './pages/admin/OwnersAdmin.jsx'
import PendingTheaters from './pages/admin/PendingTheaters.jsx'
import OwnerRoute from './routes/OwnerRoute.jsx'
import OwnerDashboard from './pages/owner/Dashboard.jsx'
import RegisterTheater from './pages/owner/RegisterTheater.jsx'
import OwnerAddMovie from './pages/owner/AddMovie.jsx'
import OwnerTheaters from './pages/owner/Theaters.jsx'
import OwnerEditTheater from './pages/owner/EditTheater.jsx'
import OwnerShows from './pages/owner/Shows.jsx'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />

            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/shows/:id" element={<ShowDetails />} />

            <Route path="/book/:showId" element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            } />
            <Route path="/checkout/:showId" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/confirmation/:bookingId" element={
              <ProtectedRoute>
                <Confirmation />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/owner" element={
              <OwnerRoute>
                <OwnerDashboard />
              </OwnerRoute>
            } />
            <Route path="/owner/theaters/new" element={
              <OwnerRoute>
                <RegisterTheater />
              </OwnerRoute>
            } />
            <Route path="/owner/movies/new" element={
              <OwnerRoute>
                <OwnerAddMovie />
              </OwnerRoute>
            } />
            <Route path="/owner/theaters" element={
              <OwnerRoute>
                <OwnerTheaters />
              </OwnerRoute>
            } />
            <Route path="/owner/theaters/:id/edit" element={
              <OwnerRoute>
                <OwnerEditTheater />
              </OwnerRoute>
            } />
            <Route path="/owner/shows" element={
              <OwnerRoute>
                <OwnerShows />
              </OwnerRoute>
            } />

            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
                {/* Default Admin view: Owner Approvals */}
                <Route index element={<OwnersAdmin />} />
              <Route path="owners" element={<OwnersAdmin />} />
              <Route path="owners/pending" element={<OwnersAdmin />} />
              <Route path="theaters/pending" element={<PendingTheaters />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
    </AuthProvider>
  )
}
