// File: src/feature/group/repository/group.repo.js
import { prisma } from "../../../db.js";

export const createGroup = (ownerId, name) =>
  prisma.group.create({
    data: {
      name,
      createdBy: ownerId,
      members: {
        create: { userId: ownerId, role: "OWNER" },
      },
    },
  });

export const findById = (id) =>
  prisma.group.findUnique({
    where: { id },
    include: {
      members: {
        select: {
          userId: true,
          role: true,
          user: { select: { id: true, name: true } },
        },
      },
    },
  });

export const findBase = (id) => prisma.group.findUnique({ where: { id } });

export const findMyGroups = (userId) =>
  prisma.group.findMany({
    where: { members: { some: { userId } } },
    orderBy: { updatedAt: "desc" },
  });

export const removeGroup = (id) => prisma.group.delete({ where: { id } });

export const transferOwner = (groupId, userId) =>
  prisma.group.update({
    where: { id: groupId },
    data: { createdBy: userId },
  });
