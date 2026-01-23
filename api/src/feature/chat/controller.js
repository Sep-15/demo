// File: src/feature/chat/controller.js
import { catchAsync } from "../../utils/catchAsync.js";
import {
  sendMessageService,
  getConversationsService,
  getChatWithUserService,
  readChatService,
  deleteChatService,
} from "./service.js";

/* 发送消息 */
export const sendMessage = catchAsync(async (req, res) => {
  const data = await sendMessageService(req.user.id, req.body);
  res.status(201).json(data);
});

/* 会话列表 */
export const getConversations = catchAsync(async (req, res) => {
  const data = await getConversationsService(req.user.id);
  res.status(200).json(data);
});

/* 与某用户的聊天记录 */
export const getChatWithUser = catchAsync(async (req, res) => {
  const targetUserId = Number(req.params.userId);
  const data = await getChatWithUserService(req.user.id, targetUserId);
  res.status(200).json(data);
});

/* 标记已读 */
export const readChat = catchAsync(async (req, res) => {
  const chatId = Number(req.params.id);
  await readChatService(req.user.id, chatId);
  res.status(204).send();
});

/* 删除消息 */
export const deleteChat = catchAsync(async (req, res) => {
  const chatId = Number(req.params.id);
  await deleteChatService(req.user.id, chatId);
  res.status(204).send();
});
