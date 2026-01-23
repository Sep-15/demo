// File: src/feature/post/controller.js
import { catchAsync } from "../../utils/catchAsync.js";
import {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
  getMyPostsService,
} from "./service.js";

/* 发帖 */
export const createPost = catchAsync(async (req, res) => {
  const data = await createPostService(req.user.id, req.body);
  res.status(201).json(data);
});

/* 帖子流 */
export const getPosts = catchAsync(async (req, res) => {
  const data = await getPostsService(req.query);
  res.status(200).json(data);
});

/* 我的帖子 */
export const getMyPosts = catchAsync(async (req, res) => {
  const data = await getMyPostsService(req.user.id);
  res.status(200).json(data);
});

/* 帖子详情 */
export const getPostById = catchAsync(async (req, res) => {
  const postId = Number(req.params.id);
  const data = await getPostByIdService(postId);
  res.status(200).json(data);
});

/* 更新帖子 */
export const updatePost = catchAsync(async (req, res) => {
  const postId = Number(req.params.id);
  const data = await updatePostService(req.user.id, postId, req.body);
  res.status(200).json(data);
});

/* 删除帖子（软删） */
export const deletePost = catchAsync(async (req, res) => {
  const postId = Number(req.params.id);
  await deletePostService(req.user.id, postId);
  res.status(204).send();
});
