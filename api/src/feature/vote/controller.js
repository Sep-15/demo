import { catchAsync } from "../../utils/catchAsync.js";
import {
  votePostService,
  unvotePostService,
  voteStatusService,
  voteCountService,
} from "./service.js";

/* 投票（点赞/踩） */
export const votePost = catchAsync(async (req, res) => {
  const data = await votePostService(req.user.id, req.body);
  res.status(201).json(data);
});

/* 取消投票 */
export const unvotePost = catchAsync(async (req, res) => {
  const postId = Number(req.params.postId);
  await unvotePostService(req.user.id, postId);
  res.status(204).send();
});

/* 投票状态 */
export const voteStatus = catchAsync(async (req, res) => {
  const postId = Number(req.params.postId);
  const data = await voteStatusService(req.user.id, postId);
  res.status(200).json(data);
});

/* 投票统计 */
export const voteCount = catchAsync(async (req, res) => {
  const postId = Number(req.params.postId);
  const data = await voteCountService(postId);
  res.status(200).json(data);
});
