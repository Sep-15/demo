const onlineUsers = new Map();
/**
 * Map<userId, Set<socketId>>
 */

export const addOnlineUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socketId);
};

export const removeOnlineUser = (userId, socketId) => {
  const set = onlineUsers.get(userId);
  if (!set) return;

  set.delete(socketId);
  if (set.size === 0) {
    onlineUsers.delete(userId);
  }
};

export const getUserSockets = (userId) => {
  return onlineUsers.get(userId) || new Set();
};
