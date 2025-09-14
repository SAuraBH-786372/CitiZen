import mongoose from 'mongoose'
import { ENV } from './config/env'
import { app } from './app'

async function start() {
  try {
    await mongoose.connect(ENV.MONGO_URI)
    app.listen(ENV.PORT, '0.0.0.0', () => {
      console.log(`API running on port ${ENV.PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (e) {
    console.error('Failed to start server:', e)
    process.exit(1)
  }
}

start()