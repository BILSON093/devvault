import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { fail } from '../utils/response';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Request Validation Middleware
 * Validates request data against a Zod schema.
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[target]);
      req[target] = data;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => e.message).join('; ');
        return fail(res, message, 400);
      }
      return fail(res, '请求参数错误', 400);
    }
  };
}
