import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { Notification } from '../models/Notification'
import { waitForUser } from '../utils/notifier'

export async function myNotifications(req: AuthRequest, res: Response) {
  const notifications = await Notification.find({ userId: req.user!._id }).sort({ createdAt: -1 })
  res.json(notifications)
}

export async function markRead(req: AuthRequest, res: Response) {
  const { id } = req.params
  const n = await Notification.findOneAndUpdate({ _id: id, userId: req.user!._id }, { read: true }, { new: true })
  if (!n) return res.status(404).json({ message: 'Not found' })
  res.json(n)
}

// Long polling endpoint: waits up to 25s for a new event for the user
export async function poll(req: AuthRequest, res: Response) {
  // Immediately end if client closed
  // Set timeout for safety
  const timer = setTimeout(() => res.status(204).end(), 25000)
  const stop = waitForUser(String(req.user!._id), () => {
    clearTimeout(timer)
    res.status(200).json({ event: 'new' })
  })
  req.on('close', () => {
    clearTimeout(timer)
    stop()
  })
}