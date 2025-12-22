import axios from "axios";

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const fallbackBaseUrl = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://cinebazaar-lhm7.onrender.com/api";

const instance = axios.create({
  baseURL: configuredBaseUrl || fallbackBaseUrl,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  setToken: (t) => {
    if (!t) localStorage.removeItem("token");
    else localStorage.setItem("token", t);
  },
  clearToken: () => {
    localStorage.removeItem("token");
  },
  get: (...a) => instance.get(...a),
  post: (...a) => instance.post(...a),
  put: (...a) => instance.put(...a),
  delete: (...a) => instance.delete(...a),
};
