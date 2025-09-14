import { Request, Response } from 'express'
import { User } from '../models/User'
import { signJwt } from '../utils/jwt'
import { AuthRequest } from '../middleware/auth'

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email already used' })
  const user = await User.create({ name, email, password, role })
  const token = signJwt({ _id: user._id, role: user.role, name: user.name })
  res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: 'Invalid credentials' })
  const ok = await user.comparePassword(password)
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
  const token = signJwt({ _id: user._id, role: user.role, name: user.name })
  res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token })
}

export async function me(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  const user = await User.findById(req.user._id).select('_id name email role')
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json(user)
}