import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError("UNAUTHORIZED", 401));
  }

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    return next(new AppError("UNAUTHORIZED", 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch {
    next(new AppError("INVALID_TOKEN", 401));
  }
};
