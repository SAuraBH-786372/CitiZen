import { Request, Response } from 'express'
import { Issue } from '../models/Issue'
import { Comment } from '../models/Comment'
import { Notification } from '../models/Notification'
import { AuthRequest } from '../middleware/auth'

// GET /issues?status=&category=&search=
export async function listIssues(req: Request, res: Response) {
  const { status, category, search } = req.query as Record<string, string>
  const filter: Record<string, any> = {}
  if (status) filter.status = status
  if (category) filter.category = category
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ]
  const issues = await Issue.find(filter).sort({ createdAt: -1 })
  const withCounts = await Promise.all(issues.map(async (i) => {
    const commentsCount = await Comment.countDocuments({ issueId: i._id })
    return { ...i.toObject(), commentsCount }
  }))
  res.json(withCounts)
}

// GET /issues/:id
export async function getIssue(req: Request, res: Response) {
  const issue = await Issue.findById(req.params.id)
  if (!issue) return res.status(404).json({ message: 'Issue not found' })
  const commentsCount = await Comment.countDocuments({ issueId: issue._id })
  res.json({ ...issue.toObject(), commentsCount })
}

// POST /issues (Citizen)
export async function createIssue(req: AuthRequest, res: Response) {
  const { title, description, category, lat, lng, address } = req.body as any
  const imageUrl = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined
  const issue = await Issue.create({
    title,
    description,
    category,
    location: { lat: Number(lat), lng: Number(lng) },
    address: address || undefined,
    imageUrl,
    createdBy: req.user!._id
  })
  res.status(201).json(issue)
}

// POST /issues/:id/votes (toggle upvote)
export async function voteIssue(req: AuthRequest, res: Response) {
  const userId = req.user!._id
  const issue = await Issue.findById(req.params.id)
  if (!issue) return res.status(404).json({ message: 'Issue not found' })
  const has = issue.upvoters.some((u: any) => String(u) === String(userId))
  if (has) {
    // remove upvote
    issue.upvoters = issue.upvoters.filter((u: any) => String(u) !== String(userId)) as any
    issue.upvotes = Math.max(0, (issue.upvotes || 0) - 1)
  } else {
    issue.upvoters.push(userId as any)
    issue.upvotes = (issue.upvotes || 0) + 1
  }
  await issue.save()
  if (!has) {
    await Notification.create({ userId: issue.createdBy, message: `Your issue "${issue.title}" received a new upvote.` })
  }
  res.json({ ...issue.toObject(), hasUpvoted: !has })
}

// PATCH /issues/:id (Official) — update status
export async function updateStatus(req: AuthRequest, res: Response) {
  const { status } = req.body
  if (!['Open','In Progress','Resolved'].includes(status)) return res.status(400).json({ message: 'Invalid status' })
  const issue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!issue) return res.status(404).json({ message: 'Issue not found' })
  await Notification.create({ userId: issue.createdBy, message: `Status of your issue "${issue.title}" changed to ${status}.` })
  res.json(issue)
}

// PATCH /issues/:id/assign (Official) — self-assign
export async function assignIssue(req: AuthRequest, res: Response) {
  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { assignedTo: req.user!._id },
    { new: true }
  )
  if (!issue) return res.status(404).json({ message: 'Issue not found' })
  await Notification.create({ userId: issue.createdBy, message: `Your issue "${issue.title}" was assigned to an official.` })
  res.json(issue)
}

// GET /issues/:id/comments
export async function listComments(req: Request, res: Response) {
  const comments = await Comment.find({ issueId: req.params.id }).sort({ createdAt: -1 }).populate('author', 'name')
  res.json(comments)
}

// POST /issues/:id/comments
export async function addComment(req: AuthRequest, res: Response) {
  const { text } = req.body
  if (!text) return res.status(400).json({ message: 'Text is required' })
  const comment = await Comment.create({ text, issueId: req.params.id, author: req.user!._id })
  const populated = await comment.populate('author', 'name')
  const issue = await Issue.findById(req.params.id)
  if (issue) {
    await Notification.create({ userId: issue.createdBy, message: `New comment on your issue "${issue.title}".` })
  }
  res.status(201).json(populated)
}

// PATCH /issues/:issueId/comments/:commentId
export async function editComment(req: AuthRequest, res: Response) {
  const { text } = req.body
  if (!text) return res.status(400).json({ message: 'Text is required' })
  const comment = await Comment.findById(req.params.commentId)
  if (!comment) return res.status(404).json({ message: 'Comment not found' })
  if (String(comment.author) !== String(req.user!._id)) return res.status(403).json({ message: 'Forbidden' })
  comment.text = text
  await comment.save()
  const populated = await comment.populate('author', 'name')
  res.json(populated)
}

// DELETE /issues/:issueId/comments/:commentId
export async function deleteComment(req: AuthRequest, res: Response) {
  const comment = await Comment.findById(req.params.commentId)
  if (!comment) return res.status(404).json({ message: 'Comment not found' })
  if (String(comment.author) !== String(req.user!._id)) return res.status(403).json({ message: 'Forbidden' })
  await comment.deleteOne()
  res.status(204).send()
}

// DELETE /issues/:id (Official only)
export async function deleteIssue(req: AuthRequest, res: Response) {
  const issue = await Issue.findById(req.params.id)
  if (!issue) return res.status(404).json({ message: 'Issue not found' })
  
  // Delete all comments associated with this issue
  await Comment.deleteMany({ issueId: req.params.id })
  
  // Delete all notifications associated with this issue
  await Notification.deleteMany({ 
    message: { $regex: issue.title, $options: 'i' }
  })
  
  // Delete the issue itself
  await issue.deleteOne()
  
  res.status(204).send()
}