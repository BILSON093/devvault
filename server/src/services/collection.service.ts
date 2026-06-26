import prisma from '../config/database';

export async function createCollection(userId: number, data: any) {
  return prisma.collection.create({
    data: { ...data, userId: userId },
  });
}

export async function getCollections(userId: number, page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const where = { userId: userId, parentId: null };

  const [list, total] = await Promise.all([
    prisma.collection.findMany({
      where,
      include: {
        children: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { resources: true } },
      },
      skip,
      take: pageSize,
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.collection.count({ where }),
  ]);

  return {
    list: list.map(serializeCollection),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getCollectionById(id: number, currentUserId?: number) {
  const collection = await prisma.collection.findUnique({
    where: { id: id },
    include: {
      user: { select: { id: true, username: true, avatar: true } },
      children: { orderBy: { sortOrder: 'asc' } },
      resources: {
        include: {
          resource: {
            include: {
              user: { select: { id: true, username: true, avatar: true } },
              tags: { include: { tag: true } },
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!collection) return null;
  if (!collection.isPublic && collection.userId !== currentUserId) {
    throw new Error('该收藏夹为私有');
  }

  return {
    ...serializeCollection(collection),
    resources: collection.resources.map((cr: any) => ({
      ...serializeResource(cr.resource),
      sortOrder: cr.sortOrder,
    })),
  };
}

export async function updateCollection(id: number, userId: number, data: any) {
  const existing = await prisma.collection.findUnique({ where: { id: id } });
  if (!existing) throw new Error('收藏夹不存在');
  if (existing.userId !== userId) throw new Error('没有权限');

  return prisma.collection.update({
    where: { id: id },
    data,
  });
}

export async function deleteCollection(id: number, userId: number) {
  const existing = await prisma.collection.findUnique({ where: { id: id } });
  if (!existing) throw new Error('收藏夹不存在');
  if (existing.userId !== userId) throw new Error('没有权限');

  await prisma.collection.delete({ where: { id: id } });
}

export async function addResource(collectionId: number, userId: number, resourceId: number) {
  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
  if (!collection) throw new Error('收藏夹不存在');
  if (collection.userId !== userId) throw new Error('没有权限');

  await prisma.$transaction([
    prisma.collectionResource.create({
      data: { collectionId: collectionId, resourceId: resourceId },
    }),
    prisma.collection.update({
      where: { id: collectionId },
      data: { resourceCount: { increment: 1 } },
    }),
  ]);
}

export async function removeResource(collectionId: number, userId: number, resourceId: number) {
  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
  if (!collection) throw new Error('收藏夹不存在');
  if (collection.userId !== userId) throw new Error('没有权限');

  await prisma.$transaction([
    prisma.collectionResource.deleteMany({
      where: { collectionId: collectionId, resourceId: resourceId },
    }),
    prisma.collection.update({
      where: { id: collectionId },
      data: { resourceCount: { decrement: 1 } },
    }),
  ]);
}

export async function forkCollection(collectionId: number, userId: number) {
  const original = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: { resources: true },
  });
  if (!original) throw new Error('收藏夹不存在');
  if (!original.isPublic) throw new Error('该收藏夹为私有，无法 Fork');

  return prisma.collection.create({
    data: {
      userId: userId,
      name: `${original.name} (Fork)`,
      description: original.description,
      isPublic: false,
      resources: {
        create: original.resources.map((r) => ({
          resourceId: r.resourceId,
          sortOrder: r.sortOrder,
        })),
      },
      resourceCount: original.resources.length,
    },
  });
}

function serializeCollection(c: any) {
  return {
    ...c,
    id: c.id,
    userId: c.userId,
    parentId: c.parentId ? c.parentId : null,
    children: c.children?.map(serializeCollection),
  };
}

function serializeResource(r: any) {
  return {
    ...r,
    id: r.id,
    userId: r.userId,
    tags: r.tags?.map((t: any) => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
  };
}
