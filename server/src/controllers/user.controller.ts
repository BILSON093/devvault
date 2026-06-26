import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { success, fail, unauthorized } from '../utils/response';
import { paramId, queryInt } from '../utils/helpers';

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const result = await userService.register(username, email, password);
    return success(res, result, '注册成功');
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    return success(res, result, '登录成功');
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return fail(res, '缺少 refreshToken');
    const result = await userService.refreshToken(refreshToken);
    return success(res, result);
  } catch (err: any) {
    return unauthorized(res, 'refreshToken 无效或已过期');
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = await userService.getUserById(req.user!.userId);
    return success(res, user);
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function updateMe(req: Request, res: Response) {
  try {
    const user = await userService.updateUser(req.user!.userId, req.body);
    return success(res, user);
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await userService.getUserPublicProfile(paramId(req.params.id));
    return success(res, user);
  } catch (err: any) {
    return fail(res, err.message, 404);
  }
}

export async function followUser(req: Request, res: Response) {
  try {
    const targetId = paramId(req.params.id);
    if (targetId === req.user!.userId) return fail(res, '不能关注自己');
    await userService.followUser(req.user!.userId, targetId);
    return success(res, null, '关注成功');
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function unfollowUser(req: Request, res: Response) {
  try {
    await userService.unfollowUser(req.user!.userId, paramId(req.params.id));
    return success(res, null, '已取消关注');
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function getFollowers(req: Request, res: Response) {
  try {
    const result = await userService.getFollowers(
      paramId(req.params.id),
      queryInt(req.query.page, 1),
      queryInt(req.query.pageSize, 20)
    );
    return success(res, result);
  } catch (err: any) {
    return fail(res, err.message);
  }
}

export async function getFollowing(req: Request, res: Response) {
  try {
    const result = await userService.getFollowing(
      paramId(req.params.id),
      queryInt(req.query.page, 1),
      queryInt(req.query.pageSize, 20)
    );
    return success(res, result);
  } catch (err: any) {
    return fail(res, err.message);
  }
}
