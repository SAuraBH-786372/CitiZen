import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'express-async-errors'
import path from 'path'
import { ENV } from './config/env'
import authRoutes from './routes/auth.routes'
import issueRoutes from './routes/issues.routes'
import notificationsRoutes from './routes/notifications.routes'

export const app = express()

app.use(cors({ origin: ENV.CLIENT_ORIGIN }))
app.use(express.json())
app.use(morgan('dev'))

// Serve static uploads from a path that works in dev (src) and prod (dist)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/issues', issueRoutes)
app.use('/api/notifications', notificationsRoutes)

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err)
  res.status(500).json({ message: 'Server error' })
})