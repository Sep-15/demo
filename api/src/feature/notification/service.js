// File: src/feature/notification/service.js
import * as repo from './repository.js';
import { emitToUser } from '../../socket/emitter.js';

/**
 * 统一通知入口
 * DB + Socket
 * 永远不 throw
 */
export const notify = async ({
  type,
  recipientId,
  actorId,
  groupId = null,
  postId = null,
  commentId = null,
  content = null,
}) => {
  if (!recipientId || recipientId === actorId) return;

  try {
    const notification = await repo.createNotification({
      type,
      recipientId,
      actorId,
      groupId,
      postId,
      commentId,
      content,
    });

    emitToUser(recipientId, 'notification:new', {
      id: notification.id,
      type,
      content,
      actorId,
      postId,
      commentId,
      createdAt: notification.createdAt,
    });
  } catch (e) {
    console.error('notify error:', e);
  }
};

/* 查询 */
export const getMyNotifications = (userId) => repo.findMyNotifications(userId);

/* 未读数 */
export const getUnreadCount = (userId) => repo.countUnread(userId);

/* 已读 */
export const readOne = async (userId, id) => {
  await repo.markRead(id, userId);
};

export const readGroup = async ({ userId, data }) => {
  const { groupId } = data;
  await repo.markGroupRead({ userId, groupId: Number(groupId) });
};

export const readPost = async ({ userId, data }) => {
  const { postId } = data;
  await repo.markPostRead({ userId, postId: Number(postId) });
};

/* 全部已读 */
export const readAll = async (userId) => {
  await repo.markAllRead(userId);
};

/* 删除 */
export const remove = async (userId, id) => {
  await repo.deleteOne(id, userId);
};
