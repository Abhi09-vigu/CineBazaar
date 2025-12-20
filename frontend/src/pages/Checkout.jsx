import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

export default function Checkout() {
  const { showId } = useParams()
  const nav = useNavigate()
  const { state } = useLocation()
  const [processing, setProcessing] = useState(false)
  const [rzpReady, setRzpReady] = useState(false)
  const [show, setShow] = useState(null)

  const total = useMemo(() => (state?.seats?.length || 0) * (state?.price || 0), [state])

  useEffect(() => {
    // fetch show details to display timing and movie/theater info
    api.get(`/shows/${showId}`).then(({ data }) => setShow(data)).catch(() => setShow(null))
    // load Razorpay script lazily
    if (window.Razorpay) { setRzpReady(true); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => setRzpReady(true)
    s.onerror = () => setRzpReady(false)
    document.body.appendChild(s)
    return () => { try { document.body.removeChild(s) } catch { /* noop */ } }
  }, [])

  const pay = async () => {
    try {
      setProcessing(true)
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID
      if (key && rzpReady) {
        // Create order on backend
        const { data: order } = await api.post('/payments/razorpay/order', { amount: total })
        const options = {
          key,
          amount: order.amount,
          currency: order.currency,
          name: 'CineBazaar',
          description: 'Movie Ticket Booking',
          order_id: order.id,
          handler: async (response) => {
            try {
              // Verify signature server-side
              await api.post('/payments/razorpay/verify', response)
              const res = await api.post('/bookings/book', { showId, seats: state.seats, amount: total, paymentId: response.razorpay_payment_id })
              nav(`/confirmation/${res.data._id}`)
            } catch (e) {
              alert(e?.response?.data?.message || 'Verification/Booking failed')
            }
          },
          prefill: {},
          theme: { color: '#7c3aed' }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Fallback to mock payment intent
        const { data } = await api.post('/payments/intent', { amount: total })
        const paymentId = data.paymentId
        const res = await api.post('/bookings/book', { showId, seats: state.seats, amount: total, paymentId })
        nav(`/confirmation/${res.data._id}`)
      }
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
        <div className="bg-gray-900 p-4 rounded space-y-1">
          {show ? (
            <>
              <div className="text-gray-300 font-semibold">{show.movie.title}</div>
              <div className="text-gray-400">{show.theater.name}</div>
              <div className="text-gray-400 text-sm">Show: {new Date(show.date).toDateString()} • {show.time}</div>
            </>
          ) : (
            <div className="h-12 skeleton" />
          )}
          <div className="text-gray-300">Seats: {state.seats.join(', ')}</div>
          <div className="text-gray-300">Price per seat: ₹{state.price}</div>
          <div className="text-lg font-semibold mt-2">Total: ₹{total.toFixed(2)}</div>
        </div>
        <button disabled={processing} onClick={pay} className="px-4 py-2 rounded bg-accent-500 hover:bg-accent-600">{processing ? 'Processing...' : 'Pay & Book'}</button>
      </main>
    </>
  )
}
