import { catchAsync } from "../../utils/catchAsync.js";
import * as authService from "./service.js";

export const register = catchAsync(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json(data);
});

export const login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json(data);
});

export const me = catchAsync(async (req, res) => {
  const data = await authService.me(req.user.id);
  res.status(200).json(data);
});
