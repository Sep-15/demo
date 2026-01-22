import * as repo from "./repository.js";

/**
 * 统一通知入口
 * 永远不 throw，避免影响主业务
 */
export const notify = async ({
  type,
  recipientId,
  actorId,
  postId = null,
  commentId = null,
  content = null,
}) => {
  if (recipientId === actorId) return;

  try {
    await repo.createNotification({
      type,
      recipientId,
      actorId,
      postId,
      commentId,
      content,
    });
  } catch (e) {
    // 吞掉所有异常，notification 不影响主流程
    console.error("notify error:", e);
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

/* 全部已读 */
export const readAll = async (userId) => {
  await repo.markAllRead(userId);
};

/* 删除 */
export const remove = async (userId, id) => {
  await repo.deleteOne(id, userId);
};
