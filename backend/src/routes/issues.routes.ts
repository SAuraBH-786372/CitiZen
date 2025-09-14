import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { requireAuth, requireRole } from '../middleware/auth'
import { addComment, assignIssue, createIssue, deleteComment, deleteIssue, editComment, getIssue, listComments, listIssues, updateStatus, voteIssue } from '../controllers/issues.controller'

const router = Router()

// Ensure uploads directory exists (works for ts-node in src and compiled dist)
const uploadsDir = path.resolve(__dirname, '../../uploads')
try { fs.mkdirSync(uploadsDir, { recursive: true }) } catch {}

const storage = multer.diskStorage({
  // Use a path relative to the compiled file location (dist/routes -> ../../uploads)
  destination: path.resolve(__dirname, '../../uploads'),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9)
    const ext = path.extname(file.originalname)
    cb(null, unique + ext)
  }
})
const upload = multer({ storage })

router.get('/', listIssues)
router.get('/:id', getIssue)
router.post('/', requireAuth, requireRole(['Citizen']), upload.single('image'), createIssue)
router.post('/:id/votes', requireAuth, voteIssue)
router.patch('/:id', requireAuth, requireRole(['Official']), updateStatus)
router.patch('/:id/assign', requireAuth, requireRole(['Official']), assignIssue)
router.delete('/:id', requireAuth, requireRole(['Official']), deleteIssue)
router.get('/:id/comments', listComments)
router.post('/:id/comments', requireAuth, addComment)
router.patch('/:issueId/comments/:commentId', requireAuth, editComment)
router.delete('/:issueId/comments/:commentId', requireAuth, deleteComment)

export default router