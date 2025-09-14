import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Users, TrendingUp } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Logged in')
      navigate('/')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-orange-50/50" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-xl" />
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <span className="text-3xl font-bold text-white">CZ</span>
              </motion.div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </CardTitle>
              <p className="text-gray-600 text-lg">Sign in to continue your civic journey</p>
            </CardHeader>
            <CardContent className="pt-2">
              <form className="space-y-6" onSubmit={onSubmit}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="text-sm font-semibold text-gray-700 block mb-3 flex items-center gap-2">
                    <Mail size={16} className="text-purple-600" />
                    Email Address
                  </label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    required 
                    className="h-14 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="text-sm font-semibold text-gray-700 block mb-3 flex items-center gap-2">
                    <Lock size={16} className="text-purple-600" />
                    Password
                  </label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={e=>setPassword(e.target.value)} 
                      required 
                      className="h-14 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl bg-white/50 backdrop-blur-sm pr-12 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    disabled={loading} 
                    size="lg" 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing you in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Sign In
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center pt-4"
                >
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      className="font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-4 transition-colors" 
                      to="/register"
                    >
                      Create one here
                    </Link>
                  </p>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side - Information Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 items-center justify-center p-12 relative overflow-hidden border-l border-gray-200">
        {/* Background decorations */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-pink-200/30 rounded-full blur-2xl" />
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-800 max-w-lg relative z-10"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">Join the Civic Revolution</h2>
          <p className="text-xl mb-8 text-gray-600">
            Connect with your community, report issues, and make a real difference in your neighborhood.
          </p>
          
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center border border-purple-200">
                <Shield className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Secure & Trusted</h3>
                <p className="text-gray-600">Your data is protected with enterprise-grade security</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center border border-pink-200">
                <Users className="text-pink-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Community Driven</h3>
                <p className="text-gray-600">Join thousands of active citizens making change</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center border border-orange-200">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Real Impact</h3>
                <p className="text-gray-600">Track progress and see your reports come to life</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}