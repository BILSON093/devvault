import prisma from '../config/database';

export async function createNotification(userId: number, senderId: number, type: string, content: string, relatedId?: number) {
  return prisma.notification.create({
    data: {
      userId: userId,
      senderId: senderId,
      type,
      content,
      relatedId: relatedId ? relatedId : null,
    },
  });
}

export async function getNotifications(userId: number, page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;

  const [list, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: userId },
      include: { sender: { select: { id: true, username: true, avatar: true } } },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where: { userId: userId } }),
    prisma.notification.count({ where: { userId: userId, isRead: false } }),
  ]);

  return {
    list: list.map((n) => ({ ...n, id: n.id, userId: n.userId, senderId: n.senderId ? n.senderId : null, relatedId: n.relatedId ? n.relatedId : null })),
    total,
    unreadCount,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function markAllRead(userId: number) {
  await prisma.notification.updateMany({
    where: { userId: userId, isRead: false },
    data: { isRead: true },
  });
}

export async function markRead(id: number, userId: number) {
  await prisma.notification.updateMany({
    where: { id: id, userId: userId },
    data: { isRead: true },
  });
}
