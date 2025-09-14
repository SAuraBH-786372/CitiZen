import React, { useState, useEffect, useMemo } from 'react'
import StatusBadge from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import api, { assetUrl } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Heart, MessageCircle, MapPin, Calendar, User, Send, Filter, Search, LayoutGrid, MapIcon, ThumbsUp, MessageSquare, Star, Reply, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Types
interface Issue {
  _id: string
  title: string
  description: string
  category: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  location: {
    type: 'Point'
    coordinates: [number, number]
    lat?: number
    lng?: number
  }
  address: string
  upvotes: number
  commentsCount: number
  images?: string[]
  imageUrl?: string
  hasUpvoted?: boolean
  reportedBy?: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface CommentType {
  _id: string
  text: string
  issueId: string
  author: {
    _id: string
    name: string
    role?: string
  }
  createdAt: string
  parentId?: string
  replies?: CommentType[]
}

interface Rating {
  _id: string
  issueId: string
  userId: string
  rating: number
  createdAt: string
}

// Helper: status color mapping for badges using our enhanced color system
function statusClass(s: string) {
  switch (s) {
    case 'Open':
      return 'bg-status-open/10 text-status-open border-status-open/20'
    case 'In Progress':
      return 'bg-status-progress/10 text-status-progress border-status-progress/20'
    case 'Resolved':
      return 'bg-status-resolved/10 text-status-resolved border-status-resolved/20'
    default:
      return 'bg-status-closed/10 text-status-closed border-status-closed/20'
  }
}

export default function Issues() {
  const { user } = useAuth()
  const [issues, setIssues] = useState<Issue[]>([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Keep original state for API compatibility
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')

  // Local UI state for upvotes and comments (simulate instant UI updates)
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({}) // session toggle state; seed from API if present
  const [commentsOpenFor, setCommentsOpenFor] = useState<string | null>(null)
  const [detailsOpenFor, setDetailsOpenFor] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, CommentType[]>>({})
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [showRating, setShowRating] = useState<Record<string, boolean>>({})

  // Filtered issues based on current filters
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesStatus = statusFilter === 'All' || issue.status === statusFilter
      const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter
      const matchesSearch = searchTerm === '' || 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesCategory && matchesSearch
    })
  }, [issues, statusFilter, categoryFilter, searchTerm])

  const query = useMemo(() => {
    const p = new URLSearchParams()
    if (status) p.set('status', status)
    if (category) p.set('category', category)
    if (search) p.set('search', search)
    return p.toString()
  }, [status, category, search])

  useEffect(() => {
    api.get(`/issues${query ? `?${query}` : ''}`).then(async res => {
      const data: Issue[] = res.data
      setIssues(data)
      setUpvoted(data.reduce((acc, it) => { if (it.hasUpvoted) acc[it._id] = true; return acc }, {} as Record<string, boolean>))
      // Prefetch comment counts list per issue if needed; here we lazy-load when modal opens
    })
  }, [query])

  const onUpvote = async (issueId: string) => {
    const togglingTo = !upvoted[issueId]
    // optimistic toggle
    setUpvoted(prev => ({ ...prev, [issueId]: togglingTo }))
    setIssues(prev => prev.map(i => i._id === issueId ? { ...i, upvotes: i.upvotes + (togglingTo ? 1 : -1) } : i))
    try {
      const res = await api.post(`/issues/${issueId}/votes`, {})
      const hasUpvoted = (res.data?.hasUpvoted ?? togglingTo) as boolean
      setUpvoted(prev => ({ ...prev, [issueId]: hasUpvoted }))
      setIssues(prev => prev.map(i => i._id === issueId ? { ...i, upvotes: res.data?.upvotes ?? i.upvotes } : i))
    } catch {
      // rollback
      setUpvoted(prev => ({ ...prev, [issueId]: !togglingTo }))
      setIssues(prev => prev.map(i => i._id === issueId ? { ...i, upvotes: i.upvotes + (!togglingTo ? 1 : -1) } : i))
    }
  }

  const openComments = async (issue: Issue) => {
    setCommentsOpenFor(issue._id)
    // lazy load comments if not present
    if (!comments[issue._id]) {
      try {
        const res = await api.get(`/issues/${issue._id}/comments`)
        setComments(prev => ({ ...prev, [issue._id]: res.data }))
      } catch {
        setComments(prev => ({ ...prev, [issue._id]: [] }))
      }
    }
  }

  const postComment = async (issue: Issue) => {
    if (!newComment.trim()) return
    const temp: CommentType = {
      _id: 'temp-' + Date.now(),
      text: newComment,
      issueId: issue._id,
      author: { _id: 'me', name: 'You' },
      createdAt: new Date().toISOString()
    }
    setComments(prev => ({ ...prev, [issue._id]: [temp, ...(prev[issue._id] || [])] }))
    setIssues(prev => prev.map(i => i._id === issue._id ? { ...i, commentsCount: i.commentsCount + 1 } : i))
    setNewComment('')
    try {
      const res = await api.post(`/issues/${issue._id}/comments`, { text: temp.text })
      const saved = res.data as CommentType
      setComments(prev => ({
        ...prev,
        [issue._id]: (prev[issue._id] || []).map(c => c._id === temp._id ? saved : c)
      }))
    } catch {
      setComments(prev => ({
        ...prev,
        [issue._id]: (prev[issue._id] || []).filter(c => c._id !== temp._id)
      }))
      setIssues(prev => prev.map(i => i._id === issue._id ? { ...i, commentsCount: Math.max(0, i.commentsCount - 1) } : i))
    }
  }

  const postReply = async (commentId: string, issueId: string) => {
    if (!replyText.trim()) return
    const temp: CommentType = {
      _id: 'temp-reply-' + Date.now(),
      text: replyText,
      issueId: issueId,
      author: { _id: 'me', name: 'You', role: 'Official' },
      createdAt: new Date().toISOString(),
      parentId: commentId
    }
    
    setComments(prev => ({
      ...prev,
      [issueId]: (prev[issueId] || []).map(c => 
        c._id === commentId 
          ? { ...c, replies: [temp, ...(c.replies || [])] }
          : c
      )
    }))
    setReplyText('')
    setReplyingTo(null)
    
    try {
      const res = await api.post(`/issues/${issueId}/comments`, { 
        text: temp.text, 
        parentId: commentId 
      })
      const saved = res.data as CommentType
      setComments(prev => ({
        ...prev,
        [issueId]: (prev[issueId] || []).map(c => 
          c._id === commentId 
            ? { ...c, replies: (c.replies || []).map(r => r._id === temp._id ? saved : r) }
            : c
        )
      }))
    } catch {
      setComments(prev => ({
        ...prev,
        [issueId]: (prev[issueId] || []).map(c => 
          c._id === commentId 
            ? { ...c, replies: (c.replies || []).filter(r => r._id !== temp._id) }
            : c
        )
      }))
    }
  }

  const submitRating = async (issueId: string) => {
    if (rating === 0) return
    try {
      await api.post(`/issues/${issueId}/rating`, { rating })
      setShowRating(prev => ({ ...prev, [issueId]: false }))
      setRating(0)
    } catch (error) {
      console.error('Failed to submit rating:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 p-8 backdrop-blur-sm border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-3xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Civic Issues Dashboard</h1>
            <p className="text-gray-600 text-lg font-medium">Track, manage, and resolve community issues efficiently</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full backdrop-blur-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{issues.length} Active Issues</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full backdrop-blur-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{filteredIssues.length} Filtered</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              {viewMode === 'grid' ? <LayoutGrid size={16} /> : <MapIcon size={16} />}
              {viewMode === 'grid' ? 'Grid View' : 'Map View'}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/70 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-300 focus:shadow-md px-3 py-2"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/70 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-300 focus:shadow-md px-3 py-2"
          >
            <option value="All">All Categories</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Safety">Safety</option>
            <option value="Transportation">Transportation</option>
            <option value="Utilities">Utilities</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-300 focus:shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 font-medium text-sm uppercase tracking-wide">Open Issues</p>
              <p className="text-3xl font-bold text-black">{issues.filter(i => i.status === 'Open').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 font-medium text-sm uppercase tracking-wide">In Progress</p>
              <p className="text-3xl font-bold text-black">{issues.filter(i => i.status === 'In Progress').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium text-sm uppercase tracking-wide">Resolved</p>
              <p className="text-3xl font-bold text-black">{issues.filter(i => i.status === 'Resolved').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium text-sm uppercase tracking-wide">Total Issues</p>
              <p className="text-3xl font-bold text-black">{issues.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Grid/List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Community Issues</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Showing {filteredIssues.length} of {issues.length} issues</span>
          </div>
        </div>

        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredIssues.map((i, index) => (
            <motion.article 
              key={i._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="group"
            >
              <Card className="card-modern hover:border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-foreground group-hover:text-blue-600 transition-colors">{i.title}</h3>
                    <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-medium ${statusClass(i.status)}`}>{i.status}</span>
                  </div>
                  <div className="mt-2 text-xs inline-flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-medium border border-primary/20">{i.category}</span>
                    <Avatar name={i.reportedBy?.name || 'Unknown'} size="sm" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {i.imageUrl ? (
                    <div className="relative overflow-hidden rounded-lg group/image">
                      <img src={assetUrl(i.imageUrl)} alt="issue" className="w-full h-40 object-cover transition-transform duration-300 group-hover/image:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-300" />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 grid place-items-center rounded-lg text-sm text-muted-foreground border-2 border-dashed">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-2" />
                        No image
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{i.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} className="text-blue-500" />
                    <span className="truncate">
                      {i.address ? `${i.address} • ` : ''}{i.location.lat.toFixed(3)}, {i.location.lng.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">Reported on {new Date(i.createdAt).toLocaleDateString()}</div>

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      onClick={() => onUpvote(i._id)} 
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        upvoted[i._id] 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:scale-105'
                      }`}
                      title="Upvote"
                    >
                      <ThumbsUp size={14} className={upvoted[i._id] ? 'text-white' : 'text-gray-600'}/> <span className={upvoted[i._id] ? 'text-white' : 'text-gray-800'}>{i.upvotes}</span>
                    </button>
                    <button 
                      onClick={() => openComments(i)} 
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-200 hover:scale-105" 
                      title="Comments"
                    >
                      <MessageSquare size={14} className="text-gray-600"/> <span className="text-gray-800">{i.commentsCount}</span>
                    </button>
                    <button 
                      onClick={() => setDetailsOpenFor(i._id)} 
                      className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      View Details
                    </button>
                    
                    {/* Rating Button for Resolved Issues */}
                    {i.status === 'Resolved' && !showRating[i._id] && (
                      <button 
                        onClick={() => setShowRating(prev => ({ ...prev, [i._id]: true }))}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <Star size={14} />
                        Rate Solution
                      </button>
                    )}
                    
                    {/* Rating Form */}
                    {showRating[i._id] && (
                      <div className="col-span-full mt-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div className="text-center">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">Rate the Solution Quality</h4>
                          <p className="text-sm text-gray-600 mb-4">How satisfied are you with how this issue was resolved?</p>
                          <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                                  star <= rating 
                                    ? 'text-yellow-500 bg-yellow-100' 
                                    : 'text-gray-300 hover:text-yellow-400'
                                }`}
                              >
                                <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => submitRating(i._id)}
                              disabled={rating === 0}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                              Submit Rating
                            </button>
                            <button
                              onClick={() => {
                                setShowRating(prev => ({ ...prev, [i._id]: false }))
                                setRating(0)
                              }}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Comments Modal */}
      {commentsOpenFor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setCommentsOpenFor(null)}>
          <div className="bg-background text-foreground rounded-xl w-full max-w-lg p-4" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="w-12" />
              <div className="text-sm font-medium">Comments</div>
              <button onClick={() => setCommentsOpenFor(null)} className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm">Close</button>
            </div>
            <div className="mt-3 max-h-64 overflow-auto space-y-3">
              {(comments[commentsOpenFor] || []).map(c => (
                <div key={c._id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" aria-hidden />
                  <div className="flex-1">
                    <div className="text-sm"><span className="font-semibold">{c.author.name}</span> <span className="text-xs text-muted-foreground">• {new Date(c.createdAt).toLocaleString()}</span></div>
                    <div className="text-sm text-foreground">{c.text}</div>
                    <div className="mt-1 text-xs text-gray-600 inline-flex items-center gap-3">
                      <button className="hover:underline text-gray-600 hover:text-gray-800">Like</button>
                      {user?.role === 'Official' && (
                        <button 
                          onClick={() => setReplyingTo(c._id)}
                          className="hover:underline text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Reply size={12} />
                          Reply
                        </button>
                      )}
                    </div>
                    
                    {/* Official Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-3 ml-4 space-y-2">
                        {c.replies.map(reply => (
                          <div key={reply._id} className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield size={14} className="text-blue-600" />
                              <span className="text-sm font-semibold text-blue-800">{reply.author.name}</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Official</span>
                              <span className="text-xs text-gray-500">• {new Date(reply.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-gray-800">{reply.text}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply Form for Officials */}
                    {replyingTo === c._id && user?.role === 'Official' && (
                      <div className="mt-3 ml-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield size={14} className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Official Reply</span>
                          </div>
                          <textarea 
                            className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" 
                            placeholder="Write your official response..."
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            rows={3}
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <button 
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                              onClick={() => {
                                const issue = issues.find(i => i._id === commentsOpenFor)
                                if (issue) postReply(c._id, issue._id)
                              }}
                            >
                              Post Reply
                            </button>
                            <button 
                              className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm"
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyText('')
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <div className="sticky bottom-0 bg-background pt-2">
                <div className="flex items-center gap-2">
                  <input className="flex-1 border rounded-full px-4 h-10 bg-background text-foreground placeholder:text-muted-foreground" placeholder="Add a comment…" value={newComment} onChange={e=>setNewComment(e.target.value)} />
                  <button className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
                    const issue = issues.find(i => i._id === commentsOpenFor)
                    if (issue) postComment(issue)
                  }}>Post</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsOpenFor && (() => {
        const issue = issues.find(i => i._id === detailsOpenFor)
        if (!issue) return null
        return (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setDetailsOpenFor(null)}>
            <div className="bg-background text-foreground rounded-xl w-full max-w-3xl p-4" onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">{issue.title}</h4>
                <button onClick={() => setDetailsOpenFor(null)} className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm">Close</button>
              </div>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {issue.imageUrl ? (
                    <img src={assetUrl(issue.imageUrl)} alt="issue" className="w-full h-60 object-cover rounded" />
                  ) : (
                    <div className="w-full h-60 bg-muted grid place-items-center rounded text-sm text-muted-foreground">No image</div>
                  )}
                  <div className="text-sm text-muted-foreground">{issue.category}</div>
                  <div className="text-sm">Status: <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded border ${statusClass(issue.status)}`}>{issue.status}</span></div>
                  <div className="text-sm">Reported: {new Date(issue.createdAt).toLocaleString()}</div>
                  <div className="text-sm flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5"/>
                    <div>
                      <div className="text-muted-foreground">{issue.address || 'No address provided'}</div>
                      <div className="text-muted-foreground text-xs">{issue.location.lat}, {issue.location.lng}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="font-semibold">Description</h5>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{issue.description}</p>
                  <div className="w-full h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center text-muted-foreground">
                    <MapPin className="mr-2" size={16} />
                    Map View
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}