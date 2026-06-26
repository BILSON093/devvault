import { Request, Response } from 'express';
import * as statsService from '../services/stats.service';
import { success, fail } from '../utils/response';

export async function getOverview(req: Request, res: Response) {
  try {
    const data = await statsService.getOverview(req.user!.userId);
    return success(res, data);
  } catch (err: any) { return fail(res, err.message); }
}

export async function getTypeDistribution(req: Request, res: Response) {
  try {
    const data = await statsService.getTypeDistribution(req.user!.userId);
    return success(res, data);
  } catch (err: any) { return fail(res, err.message); }
}

export async function getTagRanking(req: Request, res: Response) {
  try {
    const data = await statsService.getTagRanking(req.user!.userId);
    return success(res, data);
  } catch (err: any) { return fail(res, err.message); }
}

export async function getActivityHeatmap(req: Request, res: Response) {
  try {
    const data = await statsService.getActivityHeatmap(req.user!.userId);
    return success(res, data);
  } catch (err: any) { return fail(res, err.message); }
}
