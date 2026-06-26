import { Request, Response } from 'express';
import * as searchService from '../services/search.service';
import { success, fail } from '../utils/response';
import { queryInt, queryStr } from '../utils/helpers';

export async function search(req: Request, res: Response) {
  try {
    const q = queryStr(req.query.q);
    if (!q) return fail(res, '请输入搜索关键词');

    const result = await searchService.search({
      keyword: q,
      type: queryStr(req.query.type),
      tag: queryStr(req.query.tag),
      page: queryInt(req.query.page, 1),
      pageSize: queryInt(req.query.pageSize, 20),
      userId: req.user?.userId,
    });

    // Save search history
    if (req.user?.userId) {
      searchService.saveSearchHistory(req.user.userId, q).catch(() => {});
    }

    return success(res, result);
  } catch (err: any) { return fail(res, err.message); }
}

export async function getHotSearches(_req: Request, res: Response) {
  try {
    const hot = await searchService.getHotSearches();
    return success(res, hot);
  } catch (err: any) { return fail(res, err.message); }
}

export async function getSearchHistory(req: Request, res: Response) {
  try {
    const history = await searchService.getSearchHistory(req.user!.userId);
    return success(res, history);
  } catch (err: any) { return fail(res, err.message); }
}
