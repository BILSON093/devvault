import prisma from '../config/database';

const pathInclude = {
  user: { select: { id: true, username: true, avatar: true } },
  items: {
    include: {
      resource: {
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          tags: { include: { tag: true } },
        },
      },
    },
    orderBy: { sortOrder: 'asc' as const },
  },
  _count: { select: { items: true } },
};

export async function createPath(userId: number, data: any) {
  return prisma.learningPath.create({
    data: { ...data, userId: userId },
    include: { user: { select: { id: true, username: true, avatar: true } }, _count: { select: { items: true } } },
  });
}

export async function getPaths(userId: number, page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const where = { userId: userId };

  const [list, total] = await Promise.all([
    prisma.learningPath.findMany({
      where,
      include: { _count: { select: { items: true } } },
      skip,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.learningPath.count({ where }),
  ]);

  return {
    list: list.map(serializePath),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPathById(id: number, currentUserId?: number) {
  const path = await prisma.learningPath.findUnique({
    where: { id: id },
    include: pathInclude,
  });

  if (!path) return null;
  if (!path.isPublic && path.userId !== currentUserId) {
    throw new Error('该学习路线为私有');
  }

  // Calculate progress
  const totalItems = path.items.length;
  const completedItems = path.items.filter((i: any) => i.status === 'completed').length;

  return {
    ...serializePath(path),
    progress: { total: totalItems, completed: completedItems, percentage: totalItems ? Math.round(completedItems / totalItems * 100) : 0 },
  };
}

export async function updatePath(id: number, userId: number, data: any) {
  const existing = await prisma.learningPath.findUnique({ where: { id: id } });
  if (!existing) throw new Error('学习路线不存在');
  if (existing.userId !== userId) throw new Error('没有权限');

  return prisma.learningPath.update({ where: { id: id }, data });
}

export async function deletePath(id: number, userId: number) {
  const existing = await prisma.learningPath.findUnique({ where: { id: id } });
  if (!existing) throw new Error('学习路线不存在');
  if (existing.userId !== userId) throw new Error('没有权限');

  await prisma.learningPath.delete({ where: { id: id } });
}

export async function addPathItem(pathId: number, userId: number, data: { resourceId: number; sortOrder?: number }) {
  const path = await prisma.learningPath.findUnique({ where: { id: pathId } });
  if (!path) throw new Error('学习路线不存在');
  if (path.userId !== userId) throw new Error('没有权限');

  return prisma.learningPathItem.create({
    data: {
      pathId: pathId,
      resourceId: data.resourceId,
      sortOrder: data.sortOrder ?? 0,
    },
    include: { resource: true },
  });
}

export async function updatePathItem(pathId: number, itemId: number, userId: number, data: any) {
  const path = await prisma.learningPath.findUnique({ where: { id: pathId } });
  if (!path) throw new Error('学习路线不存在');
  if (path.userId !== userId) throw new Error('没有权限');

  return prisma.learningPathItem.update({
    where: { id: itemId },
    data: {
      ...data,
      completedAt: data.status === 'completed' ? new Date() : undefined,
    },
  });
}

export async function removePathItem(pathId: number, itemId: number, userId: number) {
  const path = await prisma.learningPath.findUnique({ where: { id: pathId } });
  if (!path) throw new Error('学习路线不存在');
  if (path.userId !== userId) throw new Error('没有权限');

  await prisma.learningPathItem.delete({ where: { id: itemId } });
}

export async function forkPath(pathId: number, userId: number) {
  const original = await prisma.learningPath.findUnique({
    where: { id: pathId },
    include: { items: true },
  });
  if (!original) throw new Error('学习路线不存在');
  if (!original.isPublic) throw new Error('该路线为私有，无法 Fork');

  const newPath = await prisma.$transaction(async (tx) => {
    const path = await tx.learningPath.create({
      data: {
        userId: userId,
        title: `${original.title} (Fork)`,
        description: original.description,
        isPublic: false,
        forkFrom: pathId,
      },
    });

    if (original.items.length > 0) {
      await tx.learningPathItem.createMany({
        data: original.items.map((item) => ({
          pathId: path.id,
          resourceId: item.resourceId,
          sortOrder: item.sortOrder,
          status: 'not_started',
        })),
      });
    }

    // Increment fork count
    await tx.learningPath.update({
      where: { id: pathId },
      data: { forkCount: { increment: 1 } },
    });

    return path;
  });

  return newPath;
}

export async function getExplore(page: number, pageSize: number, sort: string) {
  const skip = (page - 1) * pageSize;
  const where = { isPublic: true };

  const orderBy = sort === 'popular' ? { forkCount: 'desc' as const } : { createdAt: 'desc' as const };

  const [list, total] = await Promise.all([
    prisma.learningPath.findMany({
      where,
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        _count: { select: { items: true } },
      },
      skip,
      take: pageSize,
      orderBy,
    }),
    prisma.learningPath.count({ where }),
  ]);

  return {
    list: list.map(serializePath),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

function serializePath(p: any) {
  return {
    ...p,
    id: p.id,
    userId: p.userId,
    forkFrom: p.forkFrom ? p.forkFrom : null,
    items: p.items?.map((i: any) => ({
      ...i,
      id: i.id,
      pathId: i.pathId,
      resourceId: i.resourceId,
      resource: i.resource ? { ...i.resource, id: i.resource.id, userId: i.resource.userId } : undefined,
    })),
  };
}
