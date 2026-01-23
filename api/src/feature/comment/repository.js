// File: src/feature/comment/repository.js
import { prisma } from "../../db.js";

/* 创建评论 */
export const createComment = (authorId, data) =>
  prisma.comment.create({
    data: {
      content: data.content,
      postId: data.postId,
      parentId: data.parentId ?? null,
      authorId,
    },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

/* 查评论 */
export const findCommentById = (commentId) =>
  prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: { select: { id: true, name: true } },
      replies: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true } },
        },
      },
    },
  });

/* 更新评论 */
export const updateCommentById = (commentId, content) =>
  prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

/* 删除评论（级联） */
export const deleteCommentById = (commentId) =>
  prisma.comment.delete({
    where: { id: commentId },
  });

/* 获取回复 */
export const findReplies = (commentId) =>
  prisma.comment.findMany({
    where: { parentId: commentId },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
    },
  });
