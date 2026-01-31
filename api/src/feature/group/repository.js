import { prisma } from '../../db.js';

const DETAIL_INCLUDE = {
  members: { include: { user: true } },
  messages: {
    include: { sender: true },
    orderBy: { createdAt: 'asc' },
  },
};

export const findPrivateGroup = ({ targetId, userId }) =>
  prisma.group.findFirst({
    where: {
      isGroup: false,
      AND: [
        { members: { some: { userId: userId } } },
        { members: { some: { userId: targetId } } },
      ],
    },
    include: DETAIL_INCLUDE,
  });

export const createPrivateGroup = ({ members, content, url, userId }) =>
  prisma.group.create({
    data: {
      isGroup: false,
      creator: { connect: { id: userId } },
      members: { create: members },
      messages: { create: [{ content, url, senderId: userId }] },
    },
    include: DETAIL_INCLUDE,
  });

export const createGroup = ({ isGroup, name, members, userId, content, url }) =>
  prisma.group.create({
    data: {
      isGroup,
      name,
      creator: { connect: { id: userId } },
      members: { create: members },
      messages: { create: [{ content, url, senderId: userId }] },
    },
    include: DETAIL_INCLUDE,
  });

export const findGroupById = ({ groupId }) =>
  prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: { include: { user: true } },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: true },
      },
    },
  });

export const createMessage = async ({ content, url, groupId, senderId }) => {
  const [message] = await prisma.$transaction([
    prisma.groupMessage.create({
      data: { content, url, senderId, groupId },
      include: { sender: true },
    }),
    prisma.group.update({
      where: { id: groupId },
      data: { updatedAt: new Date() },
    }),
  ]);
  return message;
};

export const findGroups = ({ userId }) =>
  prisma.group.findMany({
    where: { members: { some: { userId } } },
    include: {
      members: { include: { user: true } },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: { sender: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
