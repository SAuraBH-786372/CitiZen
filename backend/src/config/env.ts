import 'dotenv/config'

export const ENV = {
  PORT: Number(process.env.PORT) || 4000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/civictrack',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
}