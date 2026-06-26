import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { devLogger, prodLogger } from './middlewares/logger';
import { apiLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(env.NODE_ENV === 'development' ? devLogger : prodLogger);

// Rate limiting
app.use('/api', apiLimiter);

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

export default app;
