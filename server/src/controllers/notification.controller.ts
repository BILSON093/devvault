import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';
import { success, fail } from '../utils/response';
import { paramId, queryInt } from '../utils/helpers';

export async function getNotifications(req: Request, res: Response) {
  try {
    const result = await notificationService.getNotifications(
      req.user!.userId,
      queryInt(req.query.page, 1),
      queryInt(req.query.pageSize, 20)
    );
    return success(res, result);
  } catch (err: any) { return fail(res, err.message); }
}

export async function markAllRead(req: Request, res: Response) {
  try {
    await notificationService.markAllRead(req.user!.userId);
    return success(res, null, '已全部标记为已读');
  } catch (err: any) { return fail(res, err.message); }
}

export async function markRead(req: Request, res: Response) {
  try {
    await notificationService.markRead(paramId(req.params.id), req.user!.userId);
    return success(res, null, '已标记为已读');
  } catch (err: any) { return fail(res, err.message); }
}
