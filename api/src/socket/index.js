// File: src/socket/index.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { initEmitter } from './emitter.js';

/**
 * Socket.IO 初始化
 * @param {import("http").Server} httpServer
 */
export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
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
  io.on('connection', (socket) => {
    const userId = socket.user.sub;
    console.log('[socket] connected userId =', userId);
    console.log('[socket] socket.id =', socket.id);

    socket.join(`user:${userId}`);
    console.log('[socket] joined room', `user:${userId}`);
    /* ---------- 群相关 ---------- */

    /**
     * 加入群房间
     * 前端在 HTTP join 成功后调用
     */
    socket.on('group:join', ({ groupId }) => {
      if (!groupId) return;
      socket.join(`group:${groupId}`);
    });

    /**
     * 离开群房间
     */
    socket.on('group:leave', ({ groupId }) => {
      if (!groupId) return;
      socket.leave(`group:${groupId}`);
    });

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

    /* ---------- 私聊已读（预留） ---------- */
    socket.on('chat:read', ({ targetUserId }) => {
      if (!targetUserId) return;

      socket.to(`user:${targetUserId}`).emit('chat:read', {
        fromUserId: userId,
      });
    });

    /* ---------- 断开 ---------- */
    socket.on('disconnect', () => {});
  });

  return io;
};
