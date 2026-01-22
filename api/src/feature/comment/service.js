import {
  createComment,
  findCommentById,
  updateCommentById,
  deleteCommentById,
  findReplies,
} from "./repository.js";
import { findPostById } from "../post/repository.js";
import { AppError } from "../../errors/AppError.js";
import { notify } from "../notification/service.js";

/* 创建评论 / 回复 */
export const createCommentService = async (userId, payload) => {
  if (!payload.content || payload.content.trim() === "") {
    throw new AppError("CONTENT_REQUIRED", 400);
  }

  const post = await findPostById(payload.postId);
  if (!post) {
    throw new AppError("POST_NOT_FOUND", 404);
  }

  let parent = null;
  if (payload.parentId) {
    parent = await findCommentById(payload.parentId);
    if (!parent) {
      throw new AppError("PARENT_COMMENT_NOT_FOUND", 404);
    }
  }

  const comment = await createComment(userId, payload);

  // 评论通知
  if (!payload.parentId) {
    await notify({
      type: "COMMENT",
      recipientId: post.authorId,
      actorId: userId,
      postId: post.id,
      commentId: comment.id,
    });
  }

  // 回复通知
  if (payload.parentId) {
    await notify({
      type: "REPLY",
      recipientId: parent.author.id,
      actorId: userId,
      commentId: comment.id,
    });
  }

  return mapComment(comment);
};

/* 获取评论 */
export const getCommentService = async (commentId) => {
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new AppError("COMMENT_NOT_FOUND", 404);
  }

  return mapComment(comment, true);
};

/* 更新评论 */
export const updateCommentService = async (userId, commentId, payload) => {
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new AppError("COMMENT_NOT_FOUND", 404);
  }

  if (comment.author.id !== userId) {
    throw new AppError("FORBIDDEN", 403);
  }

  if (!payload.content || payload.content.trim() === "") {
    throw new AppError("CONTENT_REQUIRED", 400);
  }

  return mapComment(await updateCommentById(commentId, payload.content));
};

/* 删除评论 */
export const deleteCommentService = async (userId, commentId) => {
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new AppError("COMMENT_NOT_FOUND", 404);
  }

  if (comment.author.id !== userId) {
    throw new AppError("FORBIDDEN", 403);
  }

  await deleteCommentById(commentId);
};

/* 获取回复 */
export const getRepliesService = async (commentId) => {
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new AppError("COMMENT_NOT_FOUND", 404);
  }

  const replies = await findReplies(commentId);
  return replies.map(mapComment);
};

/* ---------- helpers ---------- */

const mapComment = (c, withReplies = false) => {
  const base = {
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    author: c.author,
  };

  if (withReplies) {
    base.replies = c.replies.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      author: r.author,
    }));
  }

  return base;
};
