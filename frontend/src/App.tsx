import { Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Issues from './pages/Issues'
import IssueDetail from './pages/IssueDetail'
import ReportIssue from './pages/ReportIssue'
import OfficialDashboard from './pages/OfficialDashboard'
import CitizenHome from './pages/CitizenHome'
import Navbar from './components/ui/navbar'

function PrivateRoute({ children, roles }: { children: JSX.Element; roles?: ("Citizen"|"Official")[] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function HomeRoute() {
  const { user } = useAuth()
  if (!user) return <Dashboard />
  return user.role === 'Citizen' ? <CitizenHome /> : <OfficialDashboard />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/issues" element={<Issues />} />
      <Route path="/issues/:id" element={<IssueDetail />} />
      <Route
        path="/report"
        element={
          <PrivateRoute roles={["Citizen"]}>
            <ReportIssue />
          </PrivateRoute>
        }
      />
      <Route
        path="/official"
        element={
          <PrivateRoute roles={["Official"]}>
            <OfficialDashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-orange-50 to-yellow-50">
        {/* Multi-colored Decorative Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-200/25 to-yellow-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-200/15 to-purple-200/15 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-bl from-yellow-200/25 to-orange-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-tr from-purple-200/20 to-pink-200/25 rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-gradient-to-br from-emerald-200/15 to-teal-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/2 w-56 h-56 bg-gradient-to-tl from-rose-200/20 to-pink-200/15 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto py-8 relative">
            <AppRoutes />
          </main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  )
}