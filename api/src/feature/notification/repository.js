// File: src/feature/notification/repository.js
import { prisma } from "../../db.js";

export const createNotification = (data) =>
  prisma.notification.create({ data });

export const findMyNotifications = (userId) =>
  prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      actor: { select: { id: true, name: true } },
      post: { select: { id: true, content: true } },
      comment: { select: { id: true, content: true } },
    },
  });

export const countUnread = (userId) =>
  prisma.notification.count({
    where: {
      recipientId: userId,
      isRead: false,
    },
  });

export const markRead = (id, userId) =>
  prisma.notification.updateMany({
    where: { id, recipientId: userId },
    data: { isRead: true },
  });

export const markAllRead = (userId) =>
  prisma.notification.updateMany({
    where: { recipientId: userId },
    data: { isRead: true },
  });

export const deleteOne = (id, userId) =>
  prisma.notification.deleteMany({
    where: { id, recipientId: userId },
  });
