import { prisma } from "../../db.js";

/* 是否存在关注关系 */
export const findFollow = (followerId, followingId) =>
  prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

/* 创建关注 */
export const createFollow = (followerId, followingId) =>
  prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

/* 删除关注 */
export const deleteFollow = (followerId, followingId) =>
  prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

/* 我的粉丝 */
export const findFollowers = (userId) =>
  prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: { id: true, name: true },
      },
    },
  });

/* 我的关注 */
export const findFollowing = (userId) =>
  prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: { id: true, name: true },
      },
    },
  });
