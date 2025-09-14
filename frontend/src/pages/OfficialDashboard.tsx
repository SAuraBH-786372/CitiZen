import { useEffect, useMemo, useState } from 'react'
import api, { assetUrl } from '@/lib/api'
import type { Issue } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatusBadge from '@/components/ui/status-badge'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, User, Trash2, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const COLORS = ['#ef4444', '#f97316', '#10b981']

export default function OfficialDashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchIssues = async () => {
    const p = new URLSearchParams()
    if (status) p.set('status', status)
    if (category) p.set('category', category)
    const res = await api.get(`/issues${p.toString() ? `?${p}` : ''}`)
    setIssues(res.data)
  }

  useEffect(() => { fetchIssues() }, [status, category])

  const chartData = useMemo(() => {
    const open = issues.filter(i => i.status === 'Open').length
    const prog = issues.filter(i => i.status === 'In Progress').length
    const res = issues.filter(i => i.status === 'Resolved').length
    return [
      { name: 'Open', value: open },
      { name: 'In Progress', value: prog },
      { name: 'Resolved', value: res },
    ]
  }, [issues])

  const setIssueStatus = async (id: string, status: 'Open'|'In Progress'|'Resolved') => {
    try {
      const res = await api.patch(`/issues/${id}`, { status })
      setIssues(prev => prev.map(i => i._id === id ? res.data : i))
      toast.success(`Issue status updated to ${status}`)
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update status')
    }
  }

  const updateIssueStatus = async (id: string, newStatus: 'Open'|'In Progress'|'Resolved') => {
    try {
      const res = await api.patch(`/issues/${id}`, { status: newStatus })
      setIssues(prev => prev.map(i => i._id === id ? res.data : i))
      toast.success(`Issue status updated to ${newStatus}`)
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update status')
    }
  }

  const deleteIssue = async (id: string) => {
    try {
      await api.delete(`/issues/${id}`)
      setIssues(prev => prev.filter(i => i._id !== id))
      setDeleteConfirm(null)
      toast.success('Issue deleted successfully')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to delete issue')
    }
  }


  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 backdrop-blur-sm border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Official Dashboard</h1>
          <p className="text-gray-600 text-lg font-medium mb-4">Manage and resolve community issues efficiently</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full backdrop-blur-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">{issues.length} Total Issues</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full backdrop-blur-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">{issues.filter(i => i.status === 'Resolved').length} Resolved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status Filter</label>
                <select className="w-full border border-gray-200 rounded-xl h-11 px-4 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300" value={status} onChange={e=>setStatus(e.target.value)}>
                  <option value="">All Statuses</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category Filter</label>
                <select className="w-full border border-gray-200 rounded-xl h-11 px-4 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300" value={category} onChange={e=>setCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  <option>Infrastructure</option>
                  <option>Environment</option>
                  <option>Safety</option>
                  <option>Transportation</option>
                  <option>Utilities</option>
                </select>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Issue Statistics</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90}>
                    {chartData.map((_, idx) => (
                      <Cell key={`c-${idx}`} fill={COLORS[idx]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Issue Management</h2>
            <div className="text-sm text-gray-500">Managing {issues.length} issues</div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {issues.map((i, index) => (
              <motion.div
                key={i._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between gap-2">
                      <span className="truncate text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{i.title}</span>
                      <StatusBadge status={i.status} />
                    </CardTitle>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{i.createdBy?.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(i.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardHeader>
            <CardContent className="space-y-3">
              {i.imageUrl ? (
                <div className="relative overflow-hidden rounded-lg group">
                  <img src={assetUrl(i.imageUrl)} alt="issue" className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ) : (
                <div className="w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center rounded-lg text-sm text-muted-foreground border-2 border-dashed">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2" />
                    No image uploaded
                  </div>
                </div>
              )}
                  <p className="line-clamp-3 text-sm text-gray-600 leading-relaxed mb-3">{i.description}</p>
                  
                  {i.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin size={14} className="text-blue-500" />
                      <span className="truncate">{i.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <select className="border border-gray-200 rounded-lg h-10 px-3 text-sm flex-1 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300" value={i.status} onChange={e=>setIssueStatus(i._id, e.target.value as any)}>
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                    <Button 
                      onClick={() => {
                        const nextStatus = i.status === 'Open' ? 'In Progress' : i.status === 'In Progress' ? 'Resolved' : 'Open'
                        updateIssueStatus(i._id, nextStatus)
                      }}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      {i.status === 'Open' ? 'Start Work' : i.status === 'In Progress' ? 'Mark Resolved' : 'Reopen'}
                    </Button>
                    <Button 
                      onClick={() => setDeleteConfirm(i._id)}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md"
                      title="Delete Issue"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Issue</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete this issue? All associated comments and data will be lost.
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => deleteIssue(deleteConfirm)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Issue
              </Button>
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}