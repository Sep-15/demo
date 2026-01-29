import { io } from 'socket.io-client';

const URL = import.meta.env.URL || 'http://localhost:3000';
const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
