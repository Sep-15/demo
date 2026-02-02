// File: src/api/index.js
/* ================================
 * api/index.js
 * 所有接口统一从这里导出
 * ================================ */

import apiClient from './axios';

/* ---------- system ---------- */
export const healthApi = () => apiClient.get('/health');

/* ---------- auth ---------- */
export const loginApi = (data) => apiClient.post('/auth/login', data);

export const registerApi = (data) => apiClient.post('/auth/register', data);

export const meApi = () => apiClient.get('/auth/me');

/* ---------- user ---------- */
export const getUserProfileApi = (userId) => apiClient.get(`/users/${userId}`);

export const updateProfileApi = (data) => apiClient.patch('/users/me', data);

export const deleteMeApi = () => apiClient.delete('/users/me');

export const getUserPostsApi = (userId) =>
  apiClient.get(`/users/${userId}/posts`);

/* ---------- follow ---------- */
export const followUserApi = (userId) => apiClient.post(`/follows/${userId}`);

export const unfollowUserApi = (userId) =>
  apiClient.delete(`/follows/${userId}`);

export const followStatusApi = (userId) =>
  apiClient.get(`/follows/${userId}/status`);

export const myFollowersApi = () => apiClient.get('/follows/me/followers');

export const myFollowingApi = () => apiClient.get('/follows/me/following');

/* ---------- post ---------- */
export const createPostApi = (data) => apiClient.post('/posts', data);

export const getPostsApi = (params) => apiClient.get('/posts', { params });

export const getMyPostsApi = () => apiClient.get('/posts/me');

export const getPostByIdApi = (id) => apiClient.get(`/posts/${id}`);

export const updatePostApi = (id, data) =>
  apiClient.patch(`/posts/${id}`, data);

export const deletePostApi = (id) => apiClient.delete(`/posts/${id}`);

/* ---------- comment ---------- */
export const createCommentApi = (data) => apiClient.post('/comments', data);
/*
data = {
  postId,
  content,
  parentId?   // reply 用
}
*/

export const getCommentApi = (id) => apiClient.get(`/comments/${id}`);

export const updateCommentApi = (id, data) =>
  apiClient.patch(`/comments/${id}`, data);

export const deleteCommentApi = (id) => apiClient.delete(`/comments/${id}`);

export const getCommentRepliesApi = (id) =>
  apiClient.get(`/comments/${id}/replies`);

/* ---------- vote ---------- */
export const votePostApi = (postId) => apiClient.post('/votes', { postId });

export const unvotePostApi = (postId) => apiClient.delete(`/votes/${postId}`);

export const voteStatusApi = (postId) =>
  apiClient.get(`/votes/${postId}/status`);

export const voteCountApi = (postId) => apiClient.get(`/votes/${postId}/count`);

/* ---------- notification ---------- */
export const getNotificationsApi = (params) =>
  apiClient.get('/notifications', { params });

export const unreadNotificationCountApi = () =>
  apiClient.get('/notifications/unread-count');

export const readNotificationApi = (id) =>
  apiClient.patch(`/notifications/${id}/read`);

export const readGroupApi = (data) =>
  apiClient.patch('/notifications/read-group', data);

export const readPostApi = (data) =>
  apiClient.patch('/notifications/read-post', data);

export const readAllNotificationsApi = () =>
  apiClient.patch('/notifications/read-all');

export const deleteNotificationApi = (id) =>
  apiClient.delete(`/notifications/${id}`);

export const getConversationApi = (id) => apiClient.get(`/conversations/${id}`);

export const getConversationsApi = () => apiClient.get('/conversations');

export const createConversationApi = (data) =>
  apiClient.post('/conversations', data);

export const sendMessageApi = (id, data) =>
  apiClient.post(`/conversations/${id}`, data);
