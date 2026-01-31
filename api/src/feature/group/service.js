import { AppError } from '../../errors/AppError.js';
import * as repo from './repository.js';

const mapGroupToConversation = (group, userId) => {
  const isPrivate = !group.isGroup;

  const otherMember = isPrivate
    ? group.members.find((m) => m.userId !== userId)
    : null;

  const formatMessage = (msg) =>
    msg
      ? {
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          senderName: msg.sender?.name,
          createdAt: msg.createdAt,
        }
      : null;

  return {
    id: group.id,
    isGroup: group.isGroup,
    title: isPrivate ? otherMember?.user?.name || '佚名' : group.name,
    lastMessage: formatMessage(group.messages[0]),
    memberCount: group.members.length,
    updatedAt: group.updatedAt,
  };
};

export const createConversation = async ({ userId, payload }) => {
  let group;

  const { isGroup, targetId, content, memberIds, name } = payload;

  if (!isGroup) {
    const existing = await repo.findPrivateGroup({ userId, targetId });
    if (existing) return mapGroupToConversation(existing, userId);

    group = await repo.createPrivateGroup({
      content,
      userId,
      members: [{ userId: userId }, { userId: targetId }],
    });
  } else {
    const members = [
      { userId: userId, role: 'OWNER' },
      ...memberIds.map((id) => ({ userId: id })),
    ];
    group = await repo.createGroup({ isGroup, name, members, content, userId });
  }

  return mapGroupToConversation(group, userId);
};

export const getConversations = async ({ userId }) => {
  const groups = await repo.findGroups({ userId });
  return groups.map((g) => mapGroupToConversation(g, userId));
};

export const sendMessage = async ({ userId, groupId, payload }) => {
  const { content = null, url = null } = payload;
  if (!content && !url) throw new AppError('url和content不能同时为空', 400);
  return await repo.createMessage({
    content,
    url,
    groupId: Number(groupId),
    senderId: userId,
  });
};

export const getConversation = async ({ userId, groupId }) => {
  const group = await repo.findGroupById({ groupId: Number(groupId) });
  if (!group) throw new AppError('未找到对话', 404);
  const mapped = mapGroupToConversation(group, userId);
  mapped.messages = group.messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    senderId: msg.senderId,
    senderName: msg.sender?.name,
    createdAt: msg.createdAt,
    isMe: msg.senderId === userId,
  }));
  return mapped;
};
