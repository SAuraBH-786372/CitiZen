import axios from 'axios'

// Support Vite env at runtime and fall back to default
const baseURL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL)
  ? (import.meta as any).env.VITE_API_URL
  : 'http://localhost:4000/api'

const api = axios.create({
  baseURL,
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) (config.headers as any).Authorization = `Bearer ${token}`
  return config
})

// Derive API origin for static asset URLs like /uploads/...
let apiOrigin = ''
try {
  apiOrigin = new URL(baseURL).origin
} catch {
  if (typeof window !== 'undefined') apiOrigin = window.location.origin
}

export function assetUrl(path?: string | null) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/uploads/')) return apiOrigin + path
  return path
}

export default api