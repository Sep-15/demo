import {
  findUserById,
  countFollowers,
  countFollowing,
  findUserPosts,
  findLikedPosts,
} from "./repository.js";
import { AppError } from "../../errors/AppError.js";

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

  const posts = postsRaw.map((p) => ({
    id: p.id,
    content: p.content,
    createdAt: p.createdAt,
    author: p.author,
    voteCount: p.votes.length,
  }));

  const likedPosts = likedRaw.map((v) => ({
    id: v.post.id,
    content: v.post.content,
    createdAt: v.post.createdAt,
    author: v.post.author,
    voteCount: v.post.votes.length,
  }));

  return {
    user,
    counts: {
      followers,
      following,
    },
    posts,
    likedPosts,
  };
};
