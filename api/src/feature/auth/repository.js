import { prisma } from "../../db.js";

export const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};
export const createUser = async (data) => {
  const user = await prisma.user.create({
    data,
  });
  return user;
};
