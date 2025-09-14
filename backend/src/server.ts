import mongoose from 'mongoose'
import { ENV } from './config/env'
import { app } from './app'

async function start() {
  try {
    await mongoose.connect(ENV.MONGO_URI)
    app.listen(ENV.PORT, () => console.log(`API running on http://localhost:${ENV.PORT}`))
  } catch (e) {
    console.error('Failed to start', e)
    process.exit(1)
  }
}

start()