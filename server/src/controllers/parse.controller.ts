import { Request, Response } from 'express';
import { parseUrlService } from '../services/parse.service';
import { success, fail } from '../utils/response';

export async function parseUrl(req: Request, res: Response) {
  try {
    const { url } = req.body;
    const result = await parseUrlService(url);
    return success(res, result);
  } catch (err: any) {
    return fail(res, err.message);
  }
}
