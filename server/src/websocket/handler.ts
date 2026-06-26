import { sendToUser } from './index';

export function notifyFollow(followingUserId: number, followerUsername: string, followerId: number) {
  sendToUser(followingUserId, {
    type: 'notification',
    data: {
      notificationType: 'follow',
      message: `${followerUsername} 关注了你`,
      senderId: followerId,
      createdAt: new Date().toISOString(),
    },
  });
}

export function notifyLike(resourceOwnerId: number, likerUsername: string, resourceId: number) {
  sendToUser(resourceOwnerId, {
    type: 'notification',
    data: {
      notificationType: 'like',
      message: `${likerUsername} 赞了你的资源`,
      resourceId,
      createdAt: new Date().toISOString(),
    },
  });
}

export function notifyComment(resourceOwnerId: number, commenterUsername: string, resourceId: number) {
  sendToUser(resourceOwnerId, {
    type: 'notification',
    data: {
      notificationType: 'comment',
      message: `${commenterUsername} 评论了你的资源`,
      resourceId,
      createdAt: new Date().toISOString(),
    },
  });
}

export function notifyFork(pathOwnerId: number, forkerUsername: string, pathId: number) {
  sendToUser(pathOwnerId, {
    type: 'notification',
    data: {
      notificationType: 'fork',
      message: `${forkerUsername} Fork 了你的学习路线`,
      pathId,
      createdAt: new Date().toISOString(),
    },
  });
}
