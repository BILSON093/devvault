import prisma from '../config/database';
import { sortedSetIncr, sortedSetRevRange } from '../config/redis';

interface SearchInput {
  keyword: string;
  type?: string;
  tag?: string;
  page: number;
  pageSize: number;
  userId?: number;
}

export async function search(input: SearchInput) {
  const { keyword, type, tag, page, pageSize, userId } = input;
  const skip = (page - 1) * pageSize;

  // Track hot search
  sortedSetIncr('hot_searches', keyword).catch(() => {});

  const where: any = {
    OR: [
      { title: { contains: keyword } },
      { description: { contains: keyword } },
      { content: { contains: keyword } },
    ],
  };

  if (userId) {
    where.AND = [{ OR: [{ isPublic: true }, { userId }] }];
  } else {
    where.isPublic = true;
  }

  if (type) where.type = type;
  if (tag) where.tags = { some: { tag: { name: tag } } };

  const [list, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        tags: { include: { tag: true } },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.resource.count({ where }),
  ]);

  return {
    list: list.map((r) => ({
      ...r,
      tags: r.tags.map((t: any) => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function saveSearchHistory(userId: number, keyword: string) {
  const existing = await prisma.searchHistory.findFirst({
    where: { userId, keyword },
  });

  if (existing) {
    await prisma.searchHistory.update({
      where: { id: existing.id },
      data: { createdAt: new Date() },
    });
  } else {
    await prisma.searchHistory.create({
      data: { userId, keyword },
    });

    const count = await prisma.searchHistory.count({ where: { userId } });
    if (count > 20) {
      const oldest = await prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        take: count - 20,
        select: { id: true },
      });
      await prisma.searchHistory.deleteMany({
        where: { id: { in: oldest.map((o) => o.id) } },
      });
    }
  }
}

export async function getHotSearches() {
  const hot = await sortedSetRevRange('hot_searches', 0, 9);
  return hot.map((keyword, i) => ({ keyword, count: 0 }));
}

export async function getSearchHistory(userId: number) {
  return prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { keyword: true, createdAt: true },
  });
}
