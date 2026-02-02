// File: src/feature/notification/controller.js
import { catchAsync } from '../../utils/catchAsync.js';
import * as service from './service.js';

export const getNotifications = catchAsync(async (req, res) => {
  const data = await service.getMyNotifications(req.user.id);
  res.status(200).json(data);
});

export const unreadCount = catchAsync(async (req, res) => {
  const count = await service.getUnreadCount(req.user.id);
  res.status(200).json({ count });
});

export const readNotification = catchAsync(async (req, res) => {
  await service.readOne(req.user.id, Number(req.params.id));
  res.status(204).send();
});

export const readGroup = catchAsync(async (req, res) => {
  await service.readGroup({ userId: req.user.id, data: req.body });
  res.status(204).send();
});

export const readPost = catchAsync(async (req, res) => {
  await service.readPost({ userId: req.user.id, data: req.body });
  res.status(204).send();
});

export const readAllNotifications = catchAsync(async (req, res) => {
  await service.readAll(req.user.id);
  res.status(204).send();
});

export const deleteNotification = catchAsync(async (req, res) => {
  await service.remove(req.user.id, Number(req.params.id));
  res.status(204).send();
});
