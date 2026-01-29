// File: src/feature/follow/service.js
import {
  findFollow,
  createFollow,
  deleteFollow,
  findFollowers,
  findFollowing,
} from './repository.js';
import { findUserById } from '../user/repository.js';
import { AppError } from '../../errors/AppError.js';
import { notify } from '../notification/service.js';

/* 关注 */
export const follow = async (userId, targetUserId) => {
  if (userId === targetUserId) {
    throw new AppError('CANNOT_FOLLOW_SELF', 400);
  }

  const targetUser = await findUserById(targetUserId);
  if (!targetUser) {
    throw new AppError('USER_NOT_FOUND', 404);
  }

  const exists = await findFollow(userId, targetUserId);
  if (exists) {
    throw new AppError('ALREADY_FOLLOWED', 409);
  }

  await createFollow(userId, targetUserId);

  // 通知：被关注
  await notify({
    type: 'FOLLOW',
    recipientId: targetUserId,
    actorId: userId,
  });

  return { followed: true };
};

/* 取关 */
export const unfollow = async (userId, targetUserId) => {
  const exists = await findFollow(userId, targetUserId);
  if (!exists) {
    throw new AppError('NOT_FOLLOWING', 404);
  }

  await deleteFollow(userId, targetUserId);
};

/* 是否关注 */
export const getFollowStatus = async (userId, targetUserId) => {
  const exists = await findFollow(userId, targetUserId);
  return { isFollowing: Boolean(exists) };
};

/* 我的粉丝 */
export const getMyFollowers = async (userId) => {
  const rows = await findFollowers(userId);
  return rows.map((r) => r.follower);
};

/* 我的关注 */
export const getMyFollowing = async (userId) => {
  const rows = await findFollowing(userId);
  return rows.map((r) => r.following);
};
