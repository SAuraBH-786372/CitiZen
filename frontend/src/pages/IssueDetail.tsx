import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api, { assetUrl } from '@/lib/api'
import type { Issue, Comment } from '@/types'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/useAuth'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import StatusBadge from '@/components/ui/status-badge'
import { motion } from 'framer-motion'
import { Trash2, AlertTriangle } from 'lucide-react'

export default function IssueDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const { user } = useAuth()
  const [newStatus, setNewStatus] = useState<'Open' | 'In Progress' | 'Resolved'>('Open')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    api.get(`/issues/${id}`).then(res => {
      setIssue(res.data)
      setNewStatus(res.data.status)
    })
    api.get(`/issues/${id}/comments`).then(res => setComments(res.data))
  }, [id])

  const vote = async (direction: 'up'|'down') => {
    await api.post(`/issues/${id}/votes`, { direction })
    if (!issue) return
    setIssue({ ...issue, upvotes: issue.upvotes + (direction === 'down' ? -1 : 1) })
  }
  const addComment = async () => {
    if (!text.trim()) return
    const res = await api.post(`/issues/${id}/comments`, { text })
    setComments([res.data, ...comments])
    setText('')
  }

  const updateStatus = async () => {
    try {
      const res = await api.patch(`/issues/${id}`, { status: newStatus })
      setIssue(res.data)
      toast.success('Status updated')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Update failed')
    }
  }

  const deleteIssue = async () => {
    try {
      await api.delete(`/issues/${id}`)
      toast.success('Issue deleted successfully')
      navigate('/issues')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to delete issue')
    }
  }

  if (!issue) return null

  return (
    <div className="space-y-4">
      {/* Header with image and ribbon */}
      <div className="relative overflow-hidden rounded-xl border">
        {issue.imageUrl && (
          <img src={assetUrl(issue.imageUrl)} alt="issue" className="w-full max-h-72 object-cover" />
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={issue.status} />
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{issue.title}</h1>
          <p className="text-muted-foreground">{issue.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => vote('up')} className="hover:scale-[1.02] transition-transform">▲ {issue.upvotes}</Button>
          <Button variant="outline" onClick={() => vote('down')} className="hover:scale-[1.02] transition-transform">▼</Button>
        </div>
      </div>

      {user?.role === 'Official' && (
        <div className="flex flex-wrap items-center gap-2">
          <select className="border rounded-md h-10 px-3" value={newStatus} onChange={e=>setNewStatus(e.target.value as any)}>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <Button 
            onClick={updateStatus}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Update Status
          </Button>
          <Button 
            onClick={() => setShowDeleteConfirm(true)}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Issue
          </Button>
        </div>
      )}

      {user && (
        <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Add a comment" />
          <Button onClick={addComment}>Comment</Button>
        </motion.div>
      )}

      <div className="space-y-3">
        {comments.map((c, idx) => (
          <motion.div
            key={c._id}
            className={`rounded-2xl p-3 border max-w-xl ${idx % 2 ? 'ml-auto bg-muted' : 'bg-background'}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()} • {c.author.name}</div>
            <div>{c.text}</div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
                onClick={deleteIssue}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Issue
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
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