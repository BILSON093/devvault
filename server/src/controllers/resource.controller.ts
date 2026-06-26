import { Request, Response } from 'express';
import * as resourceService from '../services/resource.service';
import { success, fail, notFound } from '../utils/response';
import { paramId, queryInt, queryStr } from '../utils/helpers';

export async function createResource(req: Request, res: Response) {
  try {
    const resource = await resourceService.createResource(req.user!.userId, req.body);
    return success(res, resource, '创建成功');
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function getResources(req: Request, res: Response) {
  try {
    const result = await resourceService.getResources({
      page: queryInt(req.query.page, 1),
      pageSize: queryInt(req.query.pageSize, 20),
      type: queryStr(req.query.type),
      tag: queryStr(req.query.tag),
      keyword: queryStr(req.query.keyword),
      userId: req.query.userId ? paramId(req.query.userId) : undefined,
      currentUserId: req.user?.userId,
    });
    return success(res, result);
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function getResourceById(req: Request, res: Response) {
  try {
    const resource = await resourceService.getResourceById(paramId(req.params.id), req.user?.userId);
    if (!resource) return notFound(res);
    return success(res, resource);
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function updateResource(req: Request, res: Response) {
  try {
    const resource = await resourceService.updateResource(paramId(req.params.id), req.user!.userId, req.body);
    return success(res, resource, '更新成功');
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function deleteResource(req: Request, res: Response) {
  try {
    await resourceService.deleteResource(paramId(req.params.id), req.user!.userId);
    return success(res, null, '删除成功');
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function likeResource(req: Request, res: Response) {
  try {
    await resourceService.likeResource(req.user!.userId, paramId(req.params.id));
    return success(res, null, '点赞成功');
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function unlikeResource(req: Request, res: Response) {
  try {
    await resourceService.unlikeResource(req.user!.userId, paramId(req.params.id));
    return success(res, null, '已取消点赞');
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function getComments(req: Request, res: Response) {
  try {
    const result = await resourceService.getComments(
      paramId(req.params.id),
      queryInt(req.query.page, 1),
      queryInt(req.query.pageSize, 20)
    );
    return success(res, result);
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function createComment(req: Request, res: Response) {
  try {
    const comment = await resourceService.createComment(
      req.user!.userId,
      paramId(req.params.id),
      req.body.content,
      req.body.parentId
    );
    return success(res, comment, '评论成功');
  } catch (err: any) {
    return fail(res, err.message);
  }
}
