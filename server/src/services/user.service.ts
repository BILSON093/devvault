import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

const userSelect = {
  id: true,
  username: true,
  email: true,
  avatar: true,
  bio: true,
  role: true,
  createdAt: true,
};

export async function register(username: string, email: string, password: string) {
  // Check duplicate
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    throw new Error(existing.email === email ? '邮箱已被注册' : '用户名已被占用');
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username, email, passwordHash },
    select: userSelect,
  });

  const tokens = generateTokens({ userId: user.id, username: user.username });
  return { user, ...tokens };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('邮箱或密码错误');

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new Error('邮箱或密码错误');

  const tokens = generateTokens({ userId: user.id, username: user.username });
  return {
    user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio },
    ...tokens,
  };
}

export async function refreshToken(token: string) {
  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new Error('用户不存在');

  const tokens = generateTokens({ userId: user.id, username: user.username });
  return tokens;
}

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...userSelect,
      _count: {
        select: {
          resources: true,
          followers: true,
          following: true,
        },
      },
    },
  });
  if (!user) throw new Error('用户不存在');
  return user;
}

export async function getUserPublicProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...userSelect,
      _count: {
        select: {
          resources: { where: { isPublic: true } },
          followers: true,
          following: true,
          learningPaths: { where: { isPublic: true } },
        },
      },
    },
  });
  if (!user) throw new Error('用户不存在');
  return user;
}

export async function updateUser(userId: number, data: { username?: string; bio?: string }) {
  if (data.username) {
    const existing = await prisma.user.findFirst({
      where: { username: data.username, NOT: { id: userId } },
    });
    if (existing) throw new Error('用户名已被占用');
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: userSelect,
  });
}

export async function followUser(followerId: number, followingId: number) {
  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: followerId, followingId: followingId } },
  });
  if (existing) throw new Error('已经关注了');

  return prisma.follow.create({
    data: { followerId: followerId, followingId: followingId },
  });
}

export async function unfollowUser(followerId: number, followingId: number) {
  return prisma.follow.deleteMany({
    where: { followerId: followerId, followingId: followingId },
  });
}

export async function getFollowers(userId: number, page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const [list, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: { select: userSelect } },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.follow.count({ where: { followingId: userId } }),
  ]);

  return {
    list: list.map((f) => f.follower),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getFollowing(userId: number, page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const [list, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: { select: userSelect } },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return {
    list: list.map((f) => f.following),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

function generateTokens(payload: { userId: number; username: string }) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
