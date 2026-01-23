// File: src/feature/group/service/message.service.js
import * as repo from "../repository/message.repo.js";
import { findMember } from "../repository/member.repo.js";
import { AppError } from "../../../errors/AppError.js";

export const send = async (userId, groupId, { content }) => {
  if (!content) throw new AppError("INVALID_PARAMS", 400);

  const member = await findMember(groupId, userId);
  if (!member) throw new AppError("FORBIDDEN", 403);

  return repo.createMessage(groupId, userId, content);
};

export const list = async (userId, groupId) => {
  const member = await findMember(groupId, userId);
  if (!member) throw new AppError("FORBIDDEN", 403);

  return repo.findMessages(groupId);
};

export const markRead = async (userId, groupId) => {
  const member = await findMember(groupId, userId);
  if (!member) throw new AppError("FORBIDDEN", 403);

  const last = await repo.findLastMessageId(groupId);
  if (last) {
    await repo.updateLastRead(groupId, userId, last);
  }
};
