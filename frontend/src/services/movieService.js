import api from './api'

const create = async ({ title, description, duration, genre, language, releaseDate, poster, posterUrl }) => {
  const fd = new FormData()
  fd.append('title', title)
  fd.append('description', description)
  fd.append('duration', String(duration))
  fd.append('genre', genre)
  fd.append('language', language)
  fd.append('releaseDate', releaseDate)
  if (poster) fd.append('poster', poster)
  if (!poster && posterUrl) fd.append('posterUrl', posterUrl)
  return api.post('/admin/movies', fd)
}

export default { create }
