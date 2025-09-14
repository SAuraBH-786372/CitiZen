import 'dotenv/config'

export const ENV = {
  PORT: Number(process.env.PORT) || 4000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/civictrack',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 5242880
}