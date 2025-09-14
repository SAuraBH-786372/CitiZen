import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (payload: { name: string; email: string; password: string; role: 'Citizen' | 'Official' }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me').then(res => setUser(res.data)).catch(() => logout())
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  const register = async (payload: { name: string; email: string; password: string; role: 'Citizen' | 'Official' }) => {
    const res = await api.post('/auth/register', payload)
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)