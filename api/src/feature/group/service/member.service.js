// File: src/feature/group/service/member.service.js
import * as repo from "../repository/member.repo.js";
import { AppError } from "../../../errors/AppError.js";

export const join = async (userId, groupId) => {
  const existed = await repo.findMember(groupId, userId);
  if (existed) throw new AppError("ALREADY_IN_GROUP", 400);

  await repo.addMember(groupId, userId);
};

export const leave = async (userId, groupId) => {
  const member = await repo.findMember(groupId, userId);
  if (!member) throw new AppError("NOT_IN_GROUP", 403);

  await repo.removeMember(groupId, userId);
};
