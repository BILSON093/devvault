import prisma from '../config/database';
import redis from '../config/redis';

interface CreateResourceInput {
  title: string;
  url?: string | null;
  description?: string | null;
  content?: string | null;
  coverUrl?: string | null;
  type?: string;
  language?: string | null;
  source?: string | null;
  isPublic?: boolean;
  tagIds?: number[];
}

interface GetResourcesInput {
  page: number;
  pageSize: number;
  type?: string;
  tag?: string;
  keyword?: string;
  userId?: number;
  currentUserId?: number;
}

const resourceInclude = {
  user: { select: { id: true, username: true, avatar: true } },
  tags: { include: { tag: true } },
  _count: { select: { comments: true, likes: true } },
};

export async function createResource(userId: number, input: CreateResourceInput) {
  const { tagIds, ...data } = input;

  const resource = await prisma.resource.create({
    data: {
      ...data,
      userId: userId,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId) => ({ tagId: tagId })) }
        : undefined,
    },
    include: resourceInclude,
  });

  // Update tag usage counts
  if (tagIds?.length) {
    await prisma.tag.updateMany({
      where: { id: { in: tagIds } },
      data: { usageCount: { increment: 1 } },
    });
  }

  return serializeResource(resource);
}

export async function getResources(input: GetResourcesInput) {
  const { page, pageSize, type, tag, keyword, userId, currentUserId } = input;
  const skip = (page - 1) * pageSize;

  const where: any = {};

  // Visibility: show public resources + own private resources
  if (currentUserId) {
    where.OR = [{ isPublic: true }, { userId: currentUserId }];
  } else {
    where.isPublic = true;
  }

  if (type) where.type = type;
  if (userId) where.userId = userId;
  if (keyword) {
    where.OR = [
      ...(where.OR || []),
      { title: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }
  if (tag) {
    where.tags = { some: { tag: { name: tag } } };
  }

  const [list, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: resourceInclude,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.resource.count({ where }),
  ]);

  return {
    list: list.map(serializeResource),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getResourceById(id: number, currentUserId?: number) {
  const resource = await prisma.resource.findUnique({
    where: { id: id },
    include: {
      ...resourceInclude,
      likes: currentUserId
        ? { where: { userId: currentUserId }, take: 1 }
        : false,
    },
  });

  if (!resource) return null;

  // Increment view count (non-blocking)
  prisma.resource.update({
    where: { id: id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  return {
    ...serializeResource(resource),
    isLiked: currentUserId ? (resource as any).likes?.length > 0 : false,
  };
}

export async function updateResource(id: number, userId: number, input: Partial<CreateResourceInput>) {
  const existing = await prisma.resource.findUnique({ where: { id: id } });
  if (!existing) throw new Error('资源不存在');
  if (existing.userId !== userId) throw new Error('没有权限修改');

  const { tagIds, ...data } = input;

  // Update tags if provided
  if (tagIds !== undefined) {
    // Remove old tags
    await prisma.tagOnResource.deleteMany({ where: { resourceId: id } });
    // Add new tags
    if (tagIds.length > 0) {
      await prisma.tagOnResource.createMany({
        data: tagIds.map((tagId) => ({ resourceId: id, tagId: tagId })),
      });
    }
  }

  const resource = await prisma.resource.update({
    where: { id: id },
    data,
    include: resourceInclude,
  });

  return serializeResource(resource);
}

export async function deleteResource(id: number, userId: number) {
  const existing = await prisma.resource.findUnique({ where: { id: id } });
  if (!existing) throw new Error('资源不存在');
  if (existing.userId !== userId) throw new Error('没有权限删除');

  await prisma.resource.delete({ where: { id: id } });
}

export async function likeResource(userId: number, resourceId: number) {
  const existing = await prisma.like.findUnique({
    where: { userId_resourceId: { userId: userId, resourceId: resourceId } },
  });
  if (existing) throw new Error('已经点赞过了');

  await prisma.$transaction([
    prisma.like.create({
      data: { userId: userId, resourceId: resourceId },
    }),
    prisma.resource.update({
      where: { id: resourceId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);
}

export async function unlikeResource(userId: number, resourceId: number) {
  await prisma.$transaction([
    prisma.like.deleteMany({
      where: { userId: userId, resourceId: resourceId },
    }),
    prisma.resource.update({
      where: { id: resourceId },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);
}

export async function getComments(resourceId: number, page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;

  const [list, total] = await Promise.all([
    prisma.comment.findMany({
      where: { resourceId: resourceId, parentId: null },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        children: {
          include: { user: { select: { id: true, username: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.comment.count({ where: { resourceId: resourceId } }),
  ]);

  return {
    list: list.map(serializeComment),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function createComment(userId: number, resourceId: number, content: string, parentId?: number) {
  const comment = await prisma.comment.create({
    data: {
      userId: userId,
      resourceId: resourceId,
      parentId: parentId ? parentId : null,
      content,
    },
    include: {
      user: { select: { id: true, username: true, avatar: true } },
    },
  });

  return serializeComment(comment);
}

// Helpers
function serializeResource(r: any) {
  return {
    ...r,
    id: r.id,
    userId: r.userId,
    tags: r.tags?.map((t: any) => ({
      id: t.tag.id,
      name: t.tag.name,
      color: t.tag.color,
    })),
    _count: r._count ? {
      comments: r._count.comments,
      likes: r._count.likes,
    } : undefined,
  };
}

function serializeComment(c: any) {
  return {
    ...c,
    id: c.id,
    userId: c.userId,
    resourceId: c.resourceId,
    parentId: c.parentId ? c.parentId : null,
    children: c.children?.map(serializeComment),
  };
}
