import prisma from '../config/database';

export async function getTags(limit: number) {
  const tags = await prisma.tag.findMany({
    take: limit,
    orderBy: { usageCount: 'desc' },
  });
  return tags.map((t) => ({ ...t, id: t.id }));
}

export async function getTagResources(tagId: number, page: number, pageSize: number, currentUserId?: number) {
  const skip = (page - 1) * pageSize;

  const where: any = {
    tags: { some: { tagId: tagId } },
  };

  if (currentUserId) {
    where.OR = [{ isPublic: true }, { userId: currentUserId }];
  } else {
    where.isPublic = true;
  }

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
      id: r.id,
      userId: r.userId,
      tags: r.tags.map((t: any) => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
