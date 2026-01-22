import { prisma } from "../../db.js";

/* 用户基础信息 */
export const findUserById = (userId) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

/* 关注 / 被关注数量 */
export const countFollowers = (userId) => {
  return prisma.follow.count({
    where: { followingId: userId },
  });
};

export const countFollowing = (userId) => {
  return prisma.follow.count({
    where: { followerId: userId },
  });
};

/* 用户发布的帖子 */
export const findUserPosts = (userId) => {
  return prisma.post.findMany({
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
        select: { id: true },
      },
    },
  });
};

/* 用户点赞过的帖子 */
export const findLikedPosts = (userId) => {
  return prisma.vote.findMany({
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
};
