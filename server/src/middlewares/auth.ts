import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import { unauthorized } from '../utils/response';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * JWT Authentication Middleware
 * Extracts and verifies the access token from the Authorization header.
 */
export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, '请先登录');
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return unauthorized(res, '登录已过期，请重新登录');
    }
    return unauthorized(res, '无效的登录凭证');
  }
}

/**
 * Optional Auth Middleware
 * Attaches user if token is present, but doesn't block if missing.
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // Token invalid, just continue without user
    }
  }

  next();
}
