import { catchAsync } from '../../utils/catchAsync.js';
import * as service from './service.js';

export const createConversation = catchAsync(async (req, res) => {
  const data = await service.createConversation({
    userId: req.user.id,
    payload: req.body,
  });
  return res.status(201).json(data);
});

export const getConversations = catchAsync(async (req, res) => {
  const data = await service.getConversations({ userId: req.user.id });
  return res.status(200).json(data);
});

export const sendMessage = catchAsync(async (req, res) => {
  const data = await service.sendMessage({
    userId: req.user.id,
    groupId: req.params.id,
    payload: req.body,
  });
  return res.status(201).json(data);
});

export const getConversation = catchAsync(async (req, res) => {
  const data = await service.getConversation({
    userId: req.user.id,
    groupId: req.params.id,
  });
  return res.status(200).json(data);
});
