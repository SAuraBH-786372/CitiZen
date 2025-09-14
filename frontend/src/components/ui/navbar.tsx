import { Link, NavLink, useLocation } from 'react-router-dom'
import { Sun, Moon, Users, LogIn, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from './button'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import NotificationsBell from '@/components/notifications-bell'

function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    setDark(saved ? saved === 'dark' : false)
  }, [])
  return (
    <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} aria-label="Toggle theme">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  
  return (
    <nav className="bg-gradient-to-r from-slate-800/95 via-gray-800/95 to-slate-900/95 shadow-2xl backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 font-bold text-xl text-white hover:scale-105 transition-all duration-300 group">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
              <Users size={24} className="text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">CitiZen</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/dashboard"
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ease-in-out focus:outline-none ${
                location.pathname === '/dashboard' || location.pathname === '/'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:scale-105 active:bg-gradient-to-r active:from-purple-500/30 active:to-pink-500/30'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/issues"
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ease-in-out focus:outline-none ${
                location.pathname === '/issues'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:scale-105 active:bg-gradient-to-r active:from-purple-500/30 active:to-pink-500/30'
              }`}
            >
              Issues
            </Link>
            <Link
              to="/report"
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ease-in-out focus:outline-none ${
                location.pathname === '/report'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:scale-105 active:bg-gradient-to-r active:from-purple-500/30 active:to-pink-500/30'
              }`}
            >
              Report Issue
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === 'Official' && (
              <NavLink 
                to="/official" 
                className={({isActive}) => `inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg' 
                    : 'text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-yellow-500/20'
                }`}
              >
                <LayoutDashboard size={16}/> Official
              </NavLink>
            )}
            
            <div className="flex items-center gap-2">
              <NotificationsBell />
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/90 hidden sm:block font-medium">
                    {user.name}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout} 
                    title="Logout"
                    className="text-white/90 hover:text-white hover:bg-white/15"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              ) : (
                <NavLink to="/login">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    title="Login"
                    className="text-white border-purple-400/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent"
                  >
                    <LogIn size={16} className="mr-2"/>
                    Login
                  </Button>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}