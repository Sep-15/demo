import { getUserSockets } from "./online.js";

let io = null;

export const initEmitter = (ioInstance) => {
  io = ioInstance;
};

export const emitToUser = (userId, event, payload) => {
  if (!io) return;

  const sockets = getUserSockets(userId);
  for (const socketId of sockets) {
    io.to(socketId).emit(event, payload);
  }
};
