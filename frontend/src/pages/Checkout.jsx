import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

export default function Checkout() {
  const { showId } = useParams()
  const nav = useNavigate()
  const { state } = useLocation()
  const [processing, setProcessing] = useState(false)

  const total = useMemo(() => (state?.seats?.length || 0) * (state?.price || 0), [state])

  const pay = async () => {
    try {
      setProcessing(true)
      const { data } = await api.post('/payments/intent', { amount: total })
      const paymentId = data.paymentId
      const res = await api.post('/bookings/book', { showId, seats: state.seats, amount: total, paymentId })
      nav(`/confirmation/${res.data._id}`)
    } catch (e) {
      alert(e?.response?.data?.message || 'Payment/Booking failed')
    } finally { setProcessing(false) }
  }

  if (!state?.seats?.length) return nav(`/book/${showId}`)

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="bg-gray-900 p-4 rounded">
          <div className="text-gray-300">Seats: {state.seats.join(', ')}</div>
          <div className="text-gray-300">Price per seat: ₹{state.price}</div>
          <div className="text-lg font-semibold mt-2">Total: ₹{total.toFixed(2)}</div>
        </div>
        <button disabled={processing} onClick={pay} className="px-4 py-2 rounded bg-accent-500 hover:bg-accent-600">{processing ? 'Processing...' : 'Pay & Book'}</button>
      </main>
    </>
  )
}
