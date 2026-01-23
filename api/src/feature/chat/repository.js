// File: src/feature/chat/repository.js
import { prisma } from "../../db.js";

/* 创建消息 */
export const createChat = (senderId, receiverId, data) =>
  prisma.chat.create({
    data: {
      senderId,
      receiverId,
      content: data.content ?? null,
      url: data.url ?? null,
    },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  });

/* 会话列表（最后一条消息） */
export const findConversations = (userId) =>
  prisma.chat.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: "desc" },
    distinct: ["senderId", "receiverId"],
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  });

/* 聊天记录 */
export const findChatWithUser = (userId, targetUserId) =>
  prisma.chat.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  });

/* 查单条消息 */
export const findChatById = (chatId) =>
  prisma.chat.findUnique({
    where: { id: chatId },
  });

/* 标记已读 */
export const markChatRead = (chatId) =>
  prisma.chat.update({
    where: { id: chatId },
    data: { isRead: true },
  });

/* 删除消息 */
export const deleteChatById = (chatId) =>
  prisma.chat.delete({
    where: { id: chatId },
  });
