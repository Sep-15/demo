// File: src/feature/group/repository/member.repo.js
import { prisma } from "../../../db.js";

export const findMember = (groupId, userId) =>
  prisma.groupMember.findUnique({
    where: {
      userId_groupId: { userId, groupId },
    },
  });

export const addMember = (groupId, userId) =>
  prisma.groupMember.create({
    data: { groupId, userId },
  });

export const removeMember = (groupId, userId) =>
  prisma.groupMember.delete({
    where: {
      userId_groupId: { userId, groupId },
    },
  });
