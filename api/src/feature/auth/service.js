import argon2 from "argon2";
import jwt from "jsonwebtoken";
import * as repo from "./repository.js";
import { AppError } from "../../errors/AppError.js";

export const register = async ({ email, password, name }) => {
  const existed = await repo.findByEmail(email);
  if (existed) {
    throw new AppError("EMAIL_ALREADY_EXISTS", 409);
  }

  const hashed = await argon2.hash(password);

  const user = await repo.createUser({
    email,
    password: hashed,
    name,
  });

  return issueToken(user);
};

export const login = async ({ email, password }) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new AppError("INVALID_CREDENTIALS", 401);

  const ok = await argon2.verify(user.password, password);
  if (!ok) throw new AppError("INVALID_CREDENTIALS", 401);

  return issueToken(user);
};

export const me = async (userId) => {
  const user = await repo.findById(userId);
  if (!user) throw new AppError("UNAUTHORIZED", 401);
  return user;
};

/* ---------------- helpers ---------------- */

const issueToken = (user) => {
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const { password, ...safeUser } = user;
  return { user: safeUser, token };
};
