import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { code: 429, message: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth Rate Limiter
 * 10 attempts per 15 minutes per IP (for login/register)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { code: 429, message: '登录尝试过多，请15分钟后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Parse URL Rate Limiter
 * 30 requests per minute per IP
 */
export const parseLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { code: 429, message: '解析请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
});
