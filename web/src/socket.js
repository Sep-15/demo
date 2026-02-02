import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

socket.onAny((event, ...args) => {
  console.log('--- [Socket 全局监控] ---');
  console.log(`事件名: ${event}`);
  console.log('负载数据:', args);
});

export default socket;
