import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { markRead, myNotifications, poll } from '../controllers/notifications.controller'

const router = Router()

router.get('/', requireAuth, myNotifications)
router.get('/poll', requireAuth, poll)
router.patch('/:id/read', requireAuth, markRead)

export default router