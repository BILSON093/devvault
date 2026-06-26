import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/response';

/**
 * Global Error Handler Middleware
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return fail(res, '数据已存在，请勿重复创建', 409);
  }
  if (err.code === 'P2025') {
    return fail(res, '记录不存在', 404);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return fail(res, err.message, 400);
  }

  // Default
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  return fail(res, message, statusCode);
}
