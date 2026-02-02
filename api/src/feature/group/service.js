import { AppError } from '../../errors/AppError.js';
import { notify } from '../notification/service.js';
import { emitToGroup } from '../../socket/emitter.js';
import * as repo from './repository.js';
import { userActiveGroups } from '../../socket/index.js';

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
          url: msg.url,
          senderId: msg.senderId,
          senderName: msg.sender?.name,
          createdAt: msg.createdAt,
        }
      : null;

  return {
    id: group.id,
    isGroup: group.isGroup,
    title: isPrivate ? otherMember?.user?.name || '佚名' : group.name,
    sidebarId: isPrivate && otherMember?.user?.id,
    lastMessage: formatMessage(group.messages[0]),
    memberCount: group.members.length,
    updatedAt: group.updatedAt,
  };
};

export const createConversation = async ({ userId, payload }) => {
  let group;

  const { isGroup, targetId, content, url, memberIds, name } = payload;

  if (!isGroup) {
    const existing = await repo.findPrivateGroup({ userId, targetId });
    if (existing) return mapGroupToConversation(existing, userId);

    if (!url && !content) throw new AppError('内容和附件不能同时为空', 400);

    group = await repo.createPrivateGroup({
      content,
      url,
      userId,
      members: [{ userId: userId }, { userId: targetId }],
    });

    await notify({
      type: 'CONVERSATION',
      recipientId: targetId,
      actorId: userId,
      groupId: group.id,
      content: content,
    });
  } else {
    const members = [
      { userId: userId, role: 'OWNER' },
      ...memberIds.map((id) => ({ userId: id })),
    ];
    group = await repo.createGroup({ isGroup, name, members, content, userId });
    await Promise.all(
      memberIds.map((id) =>
        notify({
          type: 'CONVERSATION',
          recipientId: id,
          actorId: userId,
          groupId: group.id,
          content: content,
        })
      )
    );
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

  const message = await repo.createMessage({
    content,
    url,
    groupId: Number(groupId),
    senderId: userId,
  });

  const broadcastData = {
    id: message.id,
    content: message.content,
    url: message.url,
    senderId: message.sender.id,
    senderName: message.sender?.name || '未知',
    createdAt: message.createdAt,
    groupId: Number(groupId),
  };

  emitToGroup(groupId, 'message:new', broadcastData);

  const group = await repo.findGroupById({ groupId: Number(groupId) });
  const memberIds = group.members
    .map((m) => m.userId)
    .filter((id) => id != userId);
  await Promise.all(
    memberIds.map(async (memberId) => {
      const activeGroupId = userActiveGroups.get(memberId);
      const isWatchingThisGroup = activeGroupId === Number(groupId);
      if (!isWatchingThisGroup) {
        await notify({
          type: 'CONVERSATION',
          recipientId: memberId,
          actorId: userId,
          groupId: Number(groupId),
          content: content,
        });
      }
    })
  );
  return message;
};

export const getConversation = async ({ userId, groupId }) => {
  const group = await repo.findGroupById({ groupId: Number(groupId) });
  if (!group) throw new AppError('未找到对话', 404);
  const mapped = mapGroupToConversation(group, userId);
  mapped.messages = group.messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    url: msg.url,
    senderId: msg.senderId,
    senderName: msg.sender?.name,
    createdAt: msg.createdAt,
    isMe: msg.senderId === userId,
  }));
  return mapped;
};
