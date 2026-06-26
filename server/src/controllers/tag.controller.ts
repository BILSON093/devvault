import { Request, Response } from 'express';
import * as tagService from '../services/tag.service';
import { success, fail } from '../utils/response';
import { paramId, queryInt } from '../utils/helpers';

export async function getTags(req: Request, res: Response) {
  try {
    const limit = queryInt(req.query.limit, 50);
    const tags = await tagService.getTags(limit);
    return success(res, tags);
  } catch (err: any) { return fail(res, err.message); }
}

export async function getTagResources(req: Request, res: Response) {
  try {
    const result = await tagService.getTagResources(
      paramId(req.params.id),
      queryInt(req.query.page, 1),
      queryInt(req.query.pageSize, 20),
      req.user?.userId
    );
    return success(res, result);
  } catch (err: any) { return fail(res, err.message); }
}
