import { catchAsync } from "../../utils/catchAsync.js";
import { getUserProfile } from "./service.js";

export const profileController = catchAsync(async (req, res) => {
  const userId = Number(req.params.userId);

  const data = await getUserProfile(userId);

  res.status(200).json(data);
});
