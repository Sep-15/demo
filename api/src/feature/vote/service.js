import {
  findVote,
  createVote,
  updateVote,
  deleteVote,
  countVotes,
} from "./repository.js";
import { findPostById } from "../post/repository.js";
import { AppError } from "../../errors/AppError.js";
import { notify } from "../notification/service.js";

/* 投票 */
export const votePostService = async (userId, payload) => {
  const { postId, voteType } = payload;

  if (!postId || !voteType) {
    throw new AppError("INVALID_PARAMS", 400);
  }

  if (!["UP", "DOWN"].includes(voteType)) {
    throw new AppError("INVALID_VOTE_TYPE", 400);
  }

  const post = await findPostById(postId);
  if (!post) {
    throw new AppError("POST_NOT_FOUND", 404);
  }

  const existing = await findVote(userId, postId);

  if (!existing) {
    await createVote(userId, postId, voteType);

    // 只对 UP 产生通知
    if (voteType === "UP") {
      await notify({
        type: "LIKE",
        recipientId: post.authorId,
        actorId: userId,
        postId: post.id,
      });
    }

    return { voted: true, voteType };
  }

  if (existing.voteType === voteType) {
    throw new AppError("ALREADY_VOTED", 409);
  }

  await updateVote(existing.id, voteType);
  return { voted: true, voteType };
};

/* 取消投票 */
export const unvotePostService = async (userId, postId) => {
  const existing = await findVote(userId, postId);
  if (!existing) {
    throw new AppError("VOTE_NOT_FOUND", 404);
  }

  await deleteVote(userId, postId);
};

/* 投票状态 */
export const voteStatusService = async (userId, postId) => {
  const vote = await findVote(userId, postId);
  return {
    voted: Boolean(vote),
    voteType: vote?.voteType ?? null,
  };
};

/* 投票统计 */
export const voteCountService = async (postId) => {
  const rows = await countVotes(postId);

  const result = { up: 0, down: 0 };
  for (const r of rows) {
    if (r.voteType === "UP") result.up = r._count;
    if (r.voteType === "DOWN") result.down = r._count;
  }

  return result;
};
