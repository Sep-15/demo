import { catchAsync } from "../../utils/catchAsync.js";
import {
  follow,
  unfollow,
  getFollowStatus,
  getMyFollowers,
  getMyFollowing,
} from "./service.js";

/* 关注用户 */
export const followUser = catchAsync(async (req, res) => {
  const targetUserId = Number(req.params.userId);
  const data = await follow(req.user.id, targetUserId);
  res.status(201).json(data);
});

/* 取消关注 */
export const unfollowUser = catchAsync(async (req, res) => {
  const targetUserId = Number(req.params.userId);
  await unfollow(req.user.id, targetUserId);
  res.status(204).send();
});

/* 是否已关注 */
export const followStatus = catchAsync(async (req, res) => {
  const targetUserId = Number(req.params.userId);
  const data = await getFollowStatus(req.user.id, targetUserId);
  res.status(200).json(data);
});

/* 我的粉丝 */
export const myFollowers = catchAsync(async (req, res) => {
  const data = await getMyFollowers(req.user.id);
  res.status(200).json(data);
});

/* 我的关注 */
export const myFollowing = catchAsync(async (req, res) => {
  const data = await getMyFollowing(req.user.id);
  res.status(200).json(data);
});
