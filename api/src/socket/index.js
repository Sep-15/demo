// File: src/socket/index.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { initEmitter } from './emitter.js';
import { findGroups } from '../feature/group/repository.js';

/**
 * Socket.IO 初始化
 * @param {import("http").Server} httpServer
 */
export const initSocket = (httpServer) => {
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',') // 分割字符串
    .map((o) => o.trim()) // 去除每个域名的空格
    .filter(Boolean); // 移除空字符串
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  /* 让 service 层能 emit */
  initEmitter(io);

  /* ---------- 鉴权中间件 ---------- */
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) throw new Error('NO_TOKEN');

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[socket auth payload]', payload);
      socket.user = payload; // { id, email, ... }

      next();
    } catch {
      next(new Error('INVALID_TOKEN'));
    }
  });

  /* ---------- 连接 ---------- */
  io.on('connection', async (socket) => {
    const userId = socket.user.sub;
    console.log('[socket] connected userId =', userId);
    console.log('[socket] socket.id =', socket.id);

    socket.join(`user:${userId}`);
    console.log('[socket] joined room', `user:${userId}`);

    try {
      const groups = await findGroups(userId);
      const ids = groups.map((g) => g.id);
      ids.forEach((id) => socket.join(`group:${id}`));
      console.log(
        `[socket] user ${userId} auto-joined ${ids.length} groups:`,
        ids
      );
    } catch (error) {
      console.error('[socket] auto-join groups failed:', error);
    }

    /**
     * 群消息已读同步
     * 只通知其他人
     */
    socket.on('group:read', ({ groupId }) => {
      if (!groupId) return;

      socket.to(`group:${groupId}`).emit('group:read', {
        groupId,
        userId,
      });
    });

    /* ---------- 断开 ---------- */
    socket.on('disconnect', () => {});
  });

  return io;
};
