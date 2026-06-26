import { Response } from 'express';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export function success<T>(res: Response, data?: T, message = 'ok'): Response {
  return res.json({ code: 0, message, data });
}

export function fail(res: Response, message = 'error', code = 400): Response {
  return res.status(code).json({ code, message });
}

export function unauthorized(res: Response, message = '未登录或登录已过期'): Response {
  return res.status(401).json({ code: 401, message });
}

export function forbidden(res: Response, message = '没有权限'): Response {
  return res.status(403).json({ code: 403, message });
}

export function notFound(res: Response, message = '资源不存在'): Response {
  return res.status(404).json({ code: 404, message });
}
