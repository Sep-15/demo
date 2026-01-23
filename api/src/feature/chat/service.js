// File: src/feature/chat/service.js
import {
  createChat,
  findConversations,
  findChatWithUser,
  findChatById,
  markChatRead,
  deleteChatById,
} from "./repository.js";
import { findUserById } from "../user/repository.js";
import { AppError } from "../../errors/AppError.js";

/* 发送消息 */
export const sendMessageService = async (userId, payload) => {
  const { receiverId, content, url } = payload;

  if (!receiverId || (!content && !url)) {
    throw new AppError("INVALID_PARAMS", 400);
  }

  if (receiverId === userId) {
    throw new AppError("CANNOT_CHAT_SELF", 400);
  }

  const receiver = await findUserById(receiverId);
  if (!receiver) {
    throw new AppError("USER_NOT_FOUND", 404);
  }

  /* 可在此触发 Notification / WebSocket */

  return mapChat(await createChat(userId, receiverId, { content, url }));
};

/* 会话列表 */
export const getConversationsService = async (userId) => {
  const rows = await findConversations(userId);

  const map = new Map();
  for (const c of rows) {
    const other = c.senderId === userId ? c.receiver : c.sender;

    if (!map.has(other.id)) {
      map.set(other.id, {
        user: other,
        lastMessage: mapChat(c),
      });
    }
  }

  return Array.from(map.values());
};

/* 聊天记录 */
export const getChatWithUserService = async (userId, targetUserId) => {
  if (userId === targetUserId) {
    throw new AppError("INVALID_USER", 400);
  }

  const user = await findUserById(targetUserId);
  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }

  const chats = await findChatWithUser(userId, targetUserId);
  return chats.map(mapChat);
};

/* 标记已读 */
export const readChatService = async (userId, chatId) => {
  const chat = await findChatById(chatId);
  if (!chat) {
    throw new AppError("CHAT_NOT_FOUND", 404);
  }

  if (chat.receiverId !== userId) {
    throw new AppError("FORBIDDEN", 403);
  }

  await markChatRead(chatId);
};

/* 删除消息 */
export const deleteChatService = async (userId, chatId) => {
  const chat = await findChatById(chatId);
  if (!chat) {
    throw new AppError("CHAT_NOT_FOUND", 404);
  }

  if (chat.senderId !== userId) {
    throw new AppError("FORBIDDEN", 403);
  }

  await deleteChatById(chatId);
};

/* ---------- helpers ---------- */

const mapChat = (c) => ({
  id: c.id,
  content: c.content,
  url: c.url,
  isRead: c.isRead,
  createdAt: c.createdAt,
  sender: c.sender,
  receiver: c.receiver,
});
