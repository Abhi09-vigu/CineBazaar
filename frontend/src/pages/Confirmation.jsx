import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

export default function Confirmation() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  useEffect(() => { api.get('/bookings/me').then(({ data }) => setBooking(data.find(b => b._id === bookingId))) }, [bookingId])
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        {!booking ? <div className="h-40 skeleton" /> : (
          <div className="bg-gray-900 p-6 rounded space-y-3">
            <h1 className="text-2xl font-bold">Booking Confirmed</h1>
            <div className="text-gray-300">Movie: {booking.show.movie.title}</div>
            <div className="text-gray-300">Theater: {booking.show.theater.name}</div>
            <div className="text-gray-300">Seats: {booking.seats.join(', ')}</div>
            <div className="text-gray-300">Amount: ₹{booking.amount.toFixed(2)}</div>
            <div className="text-gray-400 text-sm">Booking ID: {booking._id}</div>
            <Link to="/dashboard" className="inline-block mt-4 px-4 py-2 rounded bg-accent-500 hover:bg-accent-600">Go to Dashboard</Link>
          </div>
        )}
      </main>
    </>
  )
}
