import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env'

export interface AuthRequest extends Request {
  user?: { _id: string; role: 'Citizen' | 'Official'; name: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: 'No token' })
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any
    req.user = { _id: decoded._id, role: decoded.role, name: decoded.name }
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireRole(roles: Array<'Citizen' | 'Official'>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}