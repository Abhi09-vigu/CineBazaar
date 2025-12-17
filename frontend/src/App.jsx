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
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AddMovie from './pages/admin/AddMovie.jsx'
import ManageMovies from './pages/admin/ManageMovies.jsx'
import TheatersAdmin from './pages/admin/TheatersAdmin.jsx'
import ShowsAdmin from './pages/admin/ShowsAdmin.jsx'

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

            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="add-movie" element={<AddMovie />} />
              <Route path="manage-movies" element={<ManageMovies />} />
              <Route path="theaters" element={<TheatersAdmin />} />
              <Route path="shows" element={<ShowsAdmin />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
    </AuthProvider>
  )
}
