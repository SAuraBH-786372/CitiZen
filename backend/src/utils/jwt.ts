import jwt from 'jsonwebtoken'
import { ENV } from '../config/env'

export function signJwt(payload: object) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '7d' })
}