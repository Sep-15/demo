// File: src/feature/post/repository.js
import { prisma } from "../../db.js";

/* 创建帖子 */
export const createPost = (authorId, data) =>
  prisma.post.create({
    data: {
      content: data.content,
      url: data.url ?? null,
      authorId,
    },
    include: {
      author: { select: { id: true, name: true } },
      votes: { select: { id: true } },
      _count: { select: { votes: true } },
    },
  });

/* 帖子流（只查当前用户的 vote） */
export const findPosts = (userId, { skip = 0, take = 20 }) =>
  prisma.post.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    skip,
    take,
    include: {
      author: { select: { id: true, name: true } },
      votes: {
        where: { userId }, // 是否点赞
        select: { id: true },
      },
      _count: {
        select: { votes: true }, // 点赞总数
      },
    },
  });

/* 帖子详情 */
export const findPostById = (userId, postId) =>
  prisma.post.findFirst({
    where: { id: postId, isDeleted: false },
    include: {
      author: { select: { id: true, name: true } },
      votes: {
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: { votes: true },
      },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true } },
          replies: {
            include: { author: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

/* 更新 */
export const updatePostById = (postId, data) =>
  prisma.post.update({
    where: { id: postId },
    data,
    include: {
      author: { select: { id: true, name: true } },
      votes: { select: { id: true } },
      _count: { select: { votes: true } },
    },
  });

/* 软删 */
export const softDeletePost = (postId) =>
  prisma.post.update({
    where: { id: postId },
    data: { isDeleted: true },
  });

/* 我的帖子 */
export const findMyPosts = (userId) =>
  prisma.post.findMany({
    where: { authorId: userId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      votes: {
        where: { userId },
        select: { id: true },
      },
      _count: { select: { votes: true } },
    },
  });
