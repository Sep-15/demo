// File: src/feature/group/controller.js
import { catchAsync } from "../../utils/catchAsync.js";
import * as groupService from "./service/group.service.js";
import * as memberService from "./service/member.service.js";
import * as messageService from "./service/message.service.js";

/* ---------- group ---------- */
export const createGroup = catchAsync(async (req, res) => {
  const data = await groupService.create(req.user.id, req.body);
  res.status(201).json(data);
});

export const getMyGroups = catchAsync(async (req, res) => {
  const data = await groupService.myGroups(req.user.id);
  res.json(data);
});

export const getGroup = catchAsync(async (req, res) => {
  const data = await groupService.getById(
    req.user.id,
    Number(req.params.groupId),
  );
  res.json(data);
});

export const dissolveGroup = catchAsync(async (req, res) => {
  await groupService.dissolve(req.user.id, Number(req.params.groupId));
  res.status(204).end();
});

export const transferOwner = catchAsync(async (req, res) => {
  await groupService.transferOwner(
    req.user.id,
    Number(req.params.groupId),
    Number(req.params.userId),
  );
  res.status(204).end();
});

/* ---------- member ---------- */
export const joinGroup = catchAsync(async (req, res) => {
  await memberService.join(req.user.id, Number(req.params.groupId));
  res.status(204).end();
});

export const leaveGroup = catchAsync(async (req, res) => {
  await memberService.leave(req.user.id, Number(req.params.groupId));
  res.status(204).end();
});

/* ---------- message ---------- */
export const sendGroupMessage = catchAsync(async (req, res) => {
  const data = await messageService.send(
    req.user.id,
    Number(req.params.groupId),
    req.body,
  );
  res.status(201).json(data);
});

export const getGroupMessages = catchAsync(async (req, res) => {
  const data = await messageService.list(
    req.user.id,
    Number(req.params.groupId),
  );
  res.json(data);
});

export const markGroupRead = catchAsync(async (req, res) => {
  await messageService.markRead(req.user.id, Number(req.params.groupId));
  res.status(204).end();
});
