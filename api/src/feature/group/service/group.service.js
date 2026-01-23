// File: src/feature/group/service/group.service.js
import * as repo from "../repository/group.repo.js";
import * as memberRepo from "../repository/member.repo.js";
import { AppError } from "../../../errors/AppError.js";

export const create = async (userId, { name }) => {
  if (!name) throw new AppError("INVALID_PARAMS", 400);
  return repo.createGroup(userId, name);
};

export const getById = async (userId, groupId) => {
  const group = await repo.findById(groupId);
  if (!group) throw new AppError("GROUP_NOT_FOUND", 404);

  const isMember = group.members.some((m) => m.userId === userId);
  if (!isMember) throw new AppError("FORBIDDEN", 403);

  return group;
};

export const myGroups = (userId) => repo.findMyGroups(userId);

export const dissolve = async (userId, groupId) => {
  const group = await repo.findBase(groupId);
  if (!group) throw new AppError("GROUP_NOT_FOUND", 404);
  if (group.createdBy !== userId) throw new AppError("FORBIDDEN", 403);

  await repo.removeGroup(groupId);
};

export const transferOwner = async (userId, groupId, targetUserId) => {
  const group = await repo.findBase(groupId);
  if (!group) throw new AppError("GROUP_NOT_FOUND", 404);
  if (group.createdBy !== userId) throw new AppError("FORBIDDEN", 403);

  const member = await memberRepo.findMember(groupId, targetUserId);
  if (!member) throw new AppError("TARGET_NOT_IN_GROUP", 400);

  await repo.transferOwner(groupId, targetUserId);
};
