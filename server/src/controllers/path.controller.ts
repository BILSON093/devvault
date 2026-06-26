import { Request, Response } from 'express';
import * as pathService from '../services/path.service';
import { success, fail, notFound } from '../utils/response';
import { paramId, queryInt, queryStr } from '../utils/helpers';

export async function createPath(req: Request, res: Response) {
  try {
    const path = await pathService.createPath(req.user!.userId, req.body);
    return success(res, path, '创建成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function getPaths(req: Request, res: Response) {
  try {
    const page = queryInt(req.query.page, 1);
    const pageSize = queryInt(req.query.pageSize, 20);
    const result = await pathService.getPaths(req.user!.userId, page, pageSize);
    return success(res, result);
  } catch (err: any) { return fail(res, err.message); }
}

export async function getPathById(req: Request, res: Response) {
  try {
    const path = await pathService.getPathById(paramId(req.params.id), req.user?.userId);
    if (!path) return notFound(res);
    return success(res, path);
  } catch (err: any) { return fail(res, err.message); }
}

export async function updatePath(req: Request, res: Response) {
  try {
    const path = await pathService.updatePath(paramId(req.params.id), req.user!.userId, req.body);
    return success(res, path, '更新成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function deletePath(req: Request, res: Response) {
  try {
    await pathService.deletePath(paramId(req.params.id), req.user!.userId);
    return success(res, null, '删除成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function addPathItem(req: Request, res: Response) {
  try {
    const item = await pathService.addPathItem(paramId(req.params.id), req.user!.userId, req.body);
    return success(res, item, '添加成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function updatePathItem(req: Request, res: Response) {
  try {
    const item = await pathService.updatePathItem(
      paramId(req.params.id),
      paramId(req.params.itemId),
      req.user!.userId,
      req.body
    );
    return success(res, item, '更新成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function removePathItem(req: Request, res: Response) {
  try {
    await pathService.removePathItem(paramId(req.params.id), paramId(req.params.itemId), req.user!.userId);
    return success(res, null, '已移除');
  } catch (err: any) { return fail(res, err.message); }
}

export async function forkPath(req: Request, res: Response) {
  try {
    const path = await pathService.forkPath(paramId(req.params.id), req.user!.userId);
    return success(res, path, 'Fork 成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function getExplore(req: Request, res: Response) {
  try {
    const page = queryInt(req.query.page, 1);
    const pageSize = queryInt(req.query.pageSize, 20);
    const sort = queryStr(req.query.sort) || 'newest';
    const result = await pathService.getExplore(page, pageSize, sort);
    return success(res, result);
  } catch (err: any) { return fail(res, err.message); }
}
