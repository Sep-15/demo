import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "./repository.js";
import { AppError } from "../../errors/AppError.js";
export const registerUser = async (data) => {
  const isExisted = await findUserByEmail(data.email);
  if (isExisted) {
    throw new AppError("EMAIL_ALREADY_EXISTS", 409);
  }
  const hashedPassword = await argon2.hash(data.password);
  const newData = {
    name: data.name,
    password: hashedPassword,
    email: data.email,
  };
  const { password, ...safeUser } = await createUser(newData);
  const token = jwt.sign({ sub: safeUser.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { user: safeUser, token };
};

export const loginUser = async (data) => {
  const user = await findUserByEmail(data.email);
  if (!user) throw new AppError("INVALID_CREDENTIALS", 401);
  const correct = await argon2.verify(user.password, data.password);
  if (!correct) throw new AppError("INVALID_CREDENTIALS", 401);
  const { password, ...safeUser } = user;
  const token = jwt.sign({ sub: safeUser.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { user: safeUser, token };
};
