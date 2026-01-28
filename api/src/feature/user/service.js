// File: src/feature/user/service.js
import {
  findUserById,
  updateUserById,
  softDeleteUser,
  countFollowers,
  countFollowing,
  findUserPosts,
  findLikedPosts,
} from "./repository.js";
import { AppError } from "../../errors/AppError.js";

/* 查看指定用户 */
export const getUserProfile = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }

  const [followers, following, postsRaw, likedRaw] = await Promise.all([
    countFollowers(userId),
    countFollowing(userId),
    findUserPosts(userId),
    findLikedPosts(userId),
  ]);

  return {
    user,
    counts: { followers, following },
    posts: mapPosts(postsRaw),
    likedPosts: mapLikedPosts(likedRaw),
  };
};

/* 查看自己 */
export const getMyProfile = async (userId) => {
  return getUserProfile(userId);
};

/* 更新自己 */
export const updateMyProfile = async (userId, payload) => {
  const allowed = ["name"];
  const data = Object.fromEntries(
    Object.entries(payload).filter(([k]) => allowed.includes(k)),
  );

  if (Object.keys(data).length === 0) {
    throw new AppError("NO_VALID_FIELDS", 400);
  }

  return updateUserById(userId, data);
};

/* 删除自己 */
export const deleteMyAccount = async (userId) => {
  await softDeleteUser(userId);
};

/* 仅获取用户帖子 */
export const getUserPosts = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }

  const postsRaw = await findUserPosts(userId);
  return mapPosts(postsRaw);
};

/* ---------- helpers ---------- */

const mapPosts = (posts) =>
  posts.map((p) => ({
    id: p.id,
    content: p.content,
    createdAt: p.createdAt,
    author: p.author,
    voteCount: p._count?.votes ?? p.votes.length,
    isLiked: p.votes.length > 0,
  }));

const mapLikedPosts = (votes) =>
  votes.map((v) => ({
    id: v.post.id,
    content: v.post.content,
    createdAt: v.post.createdAt,
    author: v.post.author,
    voteCount: v.post.votes.length,
    isLiked: true,
  }));
