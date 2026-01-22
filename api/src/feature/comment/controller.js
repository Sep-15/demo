import { catchAsync } from "../../utils/catchAsync.js";
import {
  createCommentService,
  getCommentService,
  updateCommentService,
  deleteCommentService,
  getRepliesService,
} from "./service.js";

/* 发表评论 / 回复 */
export const createComment = catchAsync(async (req, res) => {
  const data = await createCommentService(req.user.id, req.body);
  res.status(201).json(data);
});

/* 获取评论 */
export const getComment = catchAsync(async (req, res) => {
  const commentId = Number(req.params.id);
  const data = await getCommentService(commentId);
  res.status(200).json(data);
});

/* 更新评论 */
export const updateComment = catchAsync(async (req, res) => {
  const commentId = Number(req.params.id);
  const data = await updateCommentService(req.user.id, commentId, req.body);
  res.status(200).json(data);
});

/* 删除评论 */
export const deleteComment = catchAsync(async (req, res) => {
  const commentId = Number(req.params.id);
  await deleteCommentService(req.user.id, commentId);
  res.status(204).send();
});

/* 获取回复 */
export const getReplies = catchAsync(async (req, res) => {
  const commentId = Number(req.params.id);
  const data = await getRepliesService(commentId);
  res.status(200).json(data);
});
