import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
})

let token = null

instance.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default {
  setToken: (t) => { token = t },
  get: (...a) => instance.get(...a),
  post: (...a) => instance.post(...a),
  put: (...a) => instance.put(...a),
  delete: (...a) => instance.delete(...a)
}
