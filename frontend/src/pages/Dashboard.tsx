import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, MapPin, AlertCircle, CheckCircle, Clock, Plus } from 'lucide-react'

const issueData = [
  { name: 'Open', value: 12, color: 'hsl(var(--status-open))' },
  { name: 'In Progress', value: 7, color: 'hsl(var(--status-progress))' },
  { name: 'Resolved', value: 20, color: 'hsl(var(--status-resolved))' },
]

const categoryData = [
  { name: 'Roads', value: 15 },
  { name: 'Water Supply', value: 8 },
  { name: 'Electricity', value: 6 },
  { name: 'Sanitation', value: 10 },
]

const stats = [
  { title: 'Total Issues', value: '39', icon: AlertCircle, color: 'text-primary', bg: 'bg-primary/10' },
  { title: 'Resolved', value: '20', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  { title: 'In Progress', value: '7', icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  { title: 'Active Users', value: '156', icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 via-orange-500/10 to-yellow-500/10 p-12 backdrop-blur-sm border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-pink-200/20 to-orange-200/20 rounded-3xl"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
            CitiZen
          </h1>
          <p className="text-2xl text-gray-700 font-medium mb-4 max-w-3xl mx-auto">
            Revolutionizing Community Engagement
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Empowering citizens and officials to collaborate on civic issues with real-time tracking, transparent communication, and data-driven insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/issues">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <MapPin className="mr-2" size={20} />
                Explore Issues
              </Button>
            </Link>
            <Link to="/report">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Plus className="mr-2" size={20} />
                Report New Issue
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Issues Resolved</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="text-3xl font-bold text-pink-600 mb-2">1,200+</div>
              <div className="text-gray-600 font-medium">Active Citizens</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 group hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">{stat.title}</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300`}>
                      <Icon className={`h-6 w-6 text-purple-600 group-hover:text-purple-700 transition-colors`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Issue Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={issueData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {issueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* About Us Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        {/* Mission, Vision, Values */}
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center gap-2">
                <TrendingUp size={24} />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                To bridge the gap between citizens and local government by providing a transparent, efficient platform for reporting, tracking, and resolving civic issues that matter to our communities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200/50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-pink-700 flex items-center gap-2">
                <Users size={24} />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                To create empowered communities where every citizen has a voice, every issue is heard, and collaborative solutions drive positive change for a better tomorrow.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200/50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-orange-700 flex items-center gap-2">
                <CheckCircle size={24} />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span>Transparency in governance</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span>Community collaboration</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span>Accountability & trust</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span>Innovation for impact</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200/30">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">Platform Features</CardTitle>
            <p className="text-center text-gray-600">Comprehensive tools for effective civic engagement</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="text-white" size={24} />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Issue Reporting</h3>
                <p className="text-sm text-gray-600">Report civic problems with photos, location, and detailed descriptions</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-white" size={24} />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Real-time Tracking</h3>
                <p className="text-sm text-gray-600">Monitor issue status and progress with live updates and notifications</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Community Engagement</h3>
                <p className="text-sm text-gray-600">Vote, comment, and collaborate with fellow citizens and officials</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Data Analytics</h3>
                <p className="text-sm text-gray-600">Comprehensive insights and reports for informed decision-making</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Team Section */}
        <Card className="bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">Meet Our Development Team</CardTitle>
            <p className="text-center text-gray-600">Passionate developers building the future of civic engagement</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">SJ</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Saurabh Joshi</h3>
                <p className="text-purple-600 font-medium text-sm mb-2">Lead Full-Stack Developer</p>
                <p className="text-xs text-gray-600">React, Node.js, MongoDB specialist architecting scalable civic solutions</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">TD</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Trisa Das</h3>
                <p className="text-blue-600 font-medium text-sm mb-2">Frontend Architect & UI/UX Designer</p>
                <p className="text-xs text-gray-600">Creating intuitive interfaces and seamless user experiences</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">NG</span>
                </div>
                
                <h3 className="font-bold text-gray-800 mb-1">Nithaksha G</h3>
                <p className="text-green-600 font-medium text-sm mb-2">Backend Engineer & Database Specialist</p>
                <p className="text-xs text-gray-600">Building robust APIs and optimizing database performance</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">CM</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Chiranthan M S</h3>
                <p className="text-blue-600 font-medium text-sm mb-2">Research and data analysis</p>
                <p className="text-xs text-gray-600">Extracting relevant data from reliable sources</p>
              </div>
              
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-indigo-200/30">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">Built with Modern Technology</CardTitle>
            <p className="text-center text-gray-600">Cutting-edge tools for optimal performance and scalability</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <h4 className="font-semibold text-gray-800 mb-2">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">React 18</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">TypeScript</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Vite</span>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <h4 className="font-semibold text-gray-800 mb-2">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Node.js</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Express</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">MongoDB</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">JWT Auth</span>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <h4 className="font-semibold text-gray-800 mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Real-time Updates</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">File Uploads</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Maps Integration</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}