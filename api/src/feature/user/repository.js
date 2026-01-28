// File: src/feature/user/repository.js
import { prisma } from "../../db.js";

/* 用户基础信息 */
export const findUserById = (userId) =>
  prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

/* 更新用户 */
export const updateUserById = (userId, data) =>
  prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

/* 软删除用户 */
export const softDeleteUser = (userId) =>
  prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true },
  });

/* 关注数 */
export const countFollowers = (userId) =>
  prisma.follow.count({
    where: { followingId: userId },
  });

export const countFollowing = (userId) =>
  prisma.follow.count({
    where: { followerId: userId },
  });

/* 用户帖子 */
export const findUserPosts = (userId) =>
  prisma.post.findMany({
    where: {
      authorId: userId,
      isDeleted: false,
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true },
      },
      votes: {
        where: { userId },
      },
      _count: { select: { votes: true } },
    },
  });

/* 点赞过的帖子 */
export const findLikedPosts = (userId) =>
  prisma.vote.findMany({
    where: {
      userId,
      voteType: "UP",
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        include: {
          author: {
            select: { id: true, name: true },
          },
          votes: {
            select: { id: true },
          },
        },
      },
    },
  });
