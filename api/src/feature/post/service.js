// File: src/feature/post/service.js
import {
  createPost,
  findPosts,
  findPostById,
  updatePostById,
  softDeletePost,
  findMyPosts,
} from "./repository.js";
import { AppError } from "../../errors/AppError.js";

/* 发帖 */
export const createPostService = async (userId, payload) => {
  if (!payload.content || payload.content.trim() === "") {
    throw new AppError("CONTENT_REQUIRED", 400);
  }
  return mapPost(await createPost(userId, payload));
};

/* 帖子流 */
export const getPostsService = async (userId, query) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);
  const skip = (page - 1) * limit;

  const posts = await findPosts(userId, { skip, take: limit });
  return posts.map(mapPost);
};

/* 我的帖子 */
export const getMyPostsService = async (userId) => {
  const posts = await findMyPosts(userId);
  return posts.map(mapPost);
};

/* 帖子详情 */
export const getPostByIdService = async (userId, postId) => {
  const post = await findPostById(userId, postId);
  if (!post) throw new AppError("POST_NOT_FOUND", 404);

  return {
    ...mapPost(post),
    comments: post.comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: c.author,
      replies: c.replies,
    })),
  };
};

/* 更新 */
export const updatePostService = async (userId, postId, payload) => {
  const post = await findPostById(userId, postId);
  if (!post) throw new AppError("POST_NOT_FOUND", 404);
  if (post.author.id !== userId) throw new AppError("FORBIDDEN", 403);

  const data = {};
  if (payload.content) data.content = payload.content;
  if (payload.url !== undefined) data.url = payload.url;

  return mapPost(await updatePostById(postId, data));
};

/* 删除 */
export const deletePostService = async (userId, postId) => {
  const post = await findPostById(userId, postId);
  if (!post) throw new AppError("POST_NOT_FOUND", 404);
  if (post.author.id !== userId) throw new AppError("FORBIDDEN", 403);

  await softDeletePost(postId);
};

/* ---------- helper ---------- */

const mapPost = (p) => ({
  id: p.id,
  content: p.content,
  url: p.url,
  createdAt: p.createdAt,
  author: p.author,
  voteCount: p._count.votes,
  isLiked: p.votes.length > 0,
});
