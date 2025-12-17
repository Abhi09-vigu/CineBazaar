import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import api from '../services/api'

export default function ShowDetails() {
  const { id } = useParams()
  const [show, setShow] = useState(null)

  useEffect(() => { api.get(`/shows/${id}`).then(({ data }) => setShow(data)) }, [id])

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!show ? <div className="h-48 skeleton" /> : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{show.movie.title}</h1>
            <div className="text-gray-400">{show.theater.name} • {show.theater.location}</div>
            <div className="text-gray-400">{new Date(show.date).toDateString()} • {show.time}</div>
            <Link to={`/book/${show._id}`} className="px-4 py-2 rounded bg-accent-500 hover:bg-accent-600">Select Seats</Link>
          </div>
        )}
      </main>
    </>
  )
}
