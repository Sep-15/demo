import { catchAsync } from "../../utils/catchAsync.js";
import { loginUser, registerUser } from "./service.js";

export const register = catchAsync(async (req, res) => {
  const data = await registerUser(req.body);
  res.status(201).json({ data });
});

export const login = catchAsync(async (req, res) => {
  const data = await loginUser(req.body);
  res.status(200).json(data);
});
