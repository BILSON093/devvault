import { Request, Response } from 'express';
import * as collectionService from '../services/collection.service';
import { success, fail, notFound } from '../utils/response';
import { paramId, queryInt } from '../utils/helpers';

export async function createCollection(req: Request, res: Response) {
  try {
    const collection = await collectionService.createCollection(req.user!.userId, req.body);
    return success(res, collection, '创建成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function getCollections(req: Request, res: Response) {
  try {
    const page = queryInt(req.query.page, 1);
    const pageSize = queryInt(req.query.pageSize, 20);
    const result = await collectionService.getCollections(req.user!.userId, page, pageSize);
    return success(res, result);
  } catch (err: any) { return fail(res, err.message); }
}

export async function getCollectionById(req: Request, res: Response) {
  try {
    const collection = await collectionService.getCollectionById(paramId(req.params.id), req.user?.userId);
    if (!collection) return notFound(res);
    return success(res, collection);
  } catch (err: any) { return fail(res, err.message); }
}

export async function updateCollection(req: Request, res: Response) {
  try {
    const collection = await collectionService.updateCollection(paramId(req.params.id), req.user!.userId, req.body);
    return success(res, collection, '更新成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function deleteCollection(req: Request, res: Response) {
  try {
    await collectionService.deleteCollection(paramId(req.params.id), req.user!.userId);
    return success(res, null, '删除成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function addResourceToCollection(req: Request, res: Response) {
  try {
    const { resourceId } = req.body;
    await collectionService.addResource(paramId(req.params.id), req.user!.userId, resourceId);
    return success(res, null, '添加成功');
  } catch (err: any) { return fail(res, err.message); }
}

export async function removeResourceFromCollection(req: Request, res: Response) {
  try {
    await collectionService.removeResource(paramId(req.params.id), req.user!.userId, paramId(req.params.resourceId));
    return success(res, null, '已移除');
  } catch (err: any) { return fail(res, err.message); }
}

export async function forkCollection(req: Request, res: Response) {
  try {
    const collection = await collectionService.forkCollection(paramId(req.params.id), req.user!.userId);
    return success(res, collection, 'Fork 成功');
  } catch (err: any) { return fail(res, err.message); }
}
