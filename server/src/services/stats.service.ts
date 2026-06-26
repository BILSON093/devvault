import prisma from '../config/database';

export async function getOverview(userId: number) {
  const [
    totalResources,
    totalCollections,
    totalPaths,
    totalLikes,
    weeklyResources,
    monthlyResources,
  ] = await Promise.all([
    prisma.resource.count({ where: { userId: userId } }),
    prisma.collection.count({ where: { userId: userId } }),
    prisma.learningPath.count({ where: { userId: userId } }),
    prisma.like.count({ where: { resource: { userId: userId } } }),
    prisma.resource.count({
      where: {
        userId: userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.resource.count({
      where: {
        userId: userId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    totalResources,
    totalCollections,
    totalPaths,
    totalLikes,
    weeklyResources,
    monthlyResources,
  };
}

export async function getTypeDistribution(userId: number) {
  const result = await prisma.resource.groupBy({
    by: ['type'],
    where: { userId: userId },
    _count: { type: true },
  });

  const typeLabels: Record<string, string> = {
    article: '文章',
    video: '视频',
    repository: '仓库',
    snippet: '代码片段',
    note: '笔记',
    documentation: '文档',
    qa: '问答',
    other: '其他',
  };

  return result.map((r) => ({
    type: r.type,
    label: typeLabels[r.type] || r.type,
    count: r._count.type,
  }));
}

export async function getTagRanking(userId: number) {
  // Get tags used by this user's resources, ranked by count
  const result = await prisma.tagOnResource.groupBy({
    by: ['tagId'],
    where: {
      resource: { userId: userId },
    },
    _count: { tagId: true },
    orderBy: { _count: { tagId: 'desc' } },
    take: 15,
  });

  // Fetch tag details
  const tagIds = result.map((r) => r.tagId);
  const tags = await prisma.tag.findMany({
    where: { id: { in: tagIds } },
  });
  const tagMap = new Map(tags.map((t) => [t.id, t]));

  return result.map((r) => {
    const tag = tagMap.get(r.tagId);
    return {
      tagId: r.tagId,
      name: tag?.name || 'Unknown',
      color: tag?.color || '#999',
      count: r._count.tagId,
    };
  });
}

export async function getActivityHeatmap(userId: number) {
  // Get resource creation dates for the last 365 days
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

  const resources = await prisma.resource.findMany({
    where: {
      userId: userId,
      createdAt: { gte: oneYearAgo },
    },
    select: { createdAt: true },
  });

  // Group by date
  const dateCountMap = new Map<string, number>();
  resources.forEach((r) => {
    const dateStr = r.createdAt.toISOString().split('T')[0];
    dateCountMap.set(dateStr, (dateCountMap.get(dateStr) || 0) + 1);
  });

  // Convert to array format for ECharts
  const data: [string, number][] = [];
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    data.push([dateStr, dateCountMap.get(dateStr) || 0]);
  }

  return data;
}
