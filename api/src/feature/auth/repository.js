import { prisma } from "../../db.js";

export const findByEmail = (email) =>
  prisma.user.findUnique({
    where: { email },
  });

export const findById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

export const createUser = (data) =>
  prisma.user.create({
    data,
  });
