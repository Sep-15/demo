import { prisma } from '../../db.js';

/* 基础查询包含项（减少代码重复） */
const baseInclude = (userId) => ({
  author: { select: { id: true, name: true } },
  votes: {
    where: { userId: userId || -1 }, // 如果没传则查不到点赞状态
    select: { id: true },
  },
  _count: { select: { votes: true } },
});

/* 1. 基础查询：仅查帖子本身（用于点赞、删除校验等内部逻辑） */
export const findPostById = (postId) =>
  prisma.post.findFirst({
    where: { id: Number(postId), isDeleted: false },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

/* 2. 详情查询：包含点赞状态、评论、回复（用于详情页展示） */
export const findPostWithDetails = (userId, postId) =>
  prisma.post.findFirst({
    where: { id: Number(postId), isDeleted: false },
    include: {
      ...baseInclude(userId),
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true } },
          replies: {
            include: { author: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

/* 创建帖子 */
export const createPost = (authorId, data) =>
  prisma.post.create({
    data: {
      content: data.content ?? null,
      media: data.media ?? null,
      authorId,
    },
    include: baseInclude(authorId),
  });

/* 帖子流 */
export const findPosts = (userId, { skip = 0, take = 20 }) =>
  prisma.post.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    include: baseInclude(userId),
  });

/* 我的帖子 */
export const findMyPosts = (userId) =>
  prisma.post.findMany({
    where: { authorId: userId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: baseInclude(userId),
  });

/* 更新 */
export const updatePostById = (postId, data) =>
  prisma.post.update({
    where: { id: Number(postId) },
    data: {
      content: data.content,
      media: data.media,
    },
    include: {
      author: { select: { id: true, name: true } },
      votes: { select: { id: true } },
      _count: { select: { votes: true } },
    },
  });

/* 软删 */
export const softDeletePost = (postId) =>
  prisma.post.update({
    where: { id: Number(postId) },
    data: { isDeleted: true },
  });
