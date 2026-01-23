// File: src/feature/user/controller.js
import { catchAsync } from "../../utils/catchAsync.js";
import {
  getUserProfile,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getUserPosts,
} from "./service.js";

/* 查看指定用户 */
export const profileController = catchAsync(async (req, res) => {
  const userId = Number(req.params.userId);
  const data = await getUserProfile(userId);
  res.status(200).json(data);
});

/* 查看自己 */
export const meController = catchAsync(async (req, res) => {
  const data = await getMyProfile(req.user.id);
  res.status(200).json(data);
});

/* 更新自己 */
export const updateProfile = catchAsync(async (req, res) => {
  const data = await updateMyProfile(req.user.id, req.body);
  res.status(200).json(data);
});

/* 软删除账号 */
export const deleteMe = catchAsync(async (req, res) => {
  await deleteMyAccount(req.user.id);
  res.status(204).send();
});

/* 用户帖子 */
export const getUserPostsController = catchAsync(async (req, res) => {
  const userId = Number(req.params.userId);
  const data = await getUserPosts(userId);
  res.status(200).json(data);
});
