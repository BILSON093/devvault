import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:devvault123@localhost:3306/devvault',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // MeiliSearch
  MEILI_URL: process.env.MEILI_URL || 'http://localhost:7700',
  MEILI_KEY: process.env.MEILI_KEY || 'devvault-master-key',

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'devvault-access-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'devvault-refresh-secret',
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',

  // Server
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // File Upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
} as const;
