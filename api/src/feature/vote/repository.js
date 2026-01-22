import { prisma } from "../../db.js";

/* 查投票 */
export const findVote = (userId, postId) =>
  prisma.vote.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

/* 创建投票 */
export const createVote = (userId, postId, voteType) =>
  prisma.vote.create({
    data: {
      userId,
      postId,
      voteType,
    },
  });

/* 更新投票 */
export const updateVote = (voteId, voteType) =>
  prisma.vote.update({
    where: { id: voteId },
    data: { voteType },
  });

/* 删除投票 */
export const deleteVote = (userId, postId) =>
  prisma.vote.delete({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

/* 投票统计 */
export const countVotes = (postId) =>
  prisma.vote.groupBy({
    by: ["voteType"],
    where: { postId },
    _count: true,
  });
