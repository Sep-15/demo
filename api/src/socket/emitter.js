// File: src/socket/emitter.js

let io = null;

export const initEmitter = (ioInstance) => {
  io = ioInstance;
};

export const emitToUser = (userId, event, payload) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
};

export const emitToGroup = (groupId, event, payload) => {
  if (!io) return;
  io.to(`group:${groupId}`).emit(event, payload);
};

export { io };
