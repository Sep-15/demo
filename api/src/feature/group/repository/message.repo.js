// File: src/feature/group/repository/message.repo.js
import { prisma } from "../../../db.js";

export const createMessage = (groupId, senderId, content) =>
  prisma.groupMessage.create({
    data: { groupId, senderId, content },
    include: {
      sender: { select: { id: true, name: true } },
    },
  });

export const findMessages = (groupId) =>
  prisma.groupMessage.findMany({
    where: { groupId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true } },
    },
  });

export const findLastMessageId = async (groupId) => {
  const last = await prisma.groupMessage.findFirst({
    where: { groupId },
    orderBy: { id: "desc" },
    select: { id: true },
  });
  return last?.id ?? null;
};

export const updateLastRead = (groupId, userId, messageId) =>
  prisma.groupMember.update({
    where: { userId_groupId: { userId, groupId } },
    data: { lastReadMessageId: messageId },
  });
