import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

/* auth */
import { login, register, me } from "../feature/auth/controller.js";

/* user */
import {
  profileController,
  updateProfile,
  deleteMe,
  getUserPostsController,
} from "../feature/user/controller.js";

/* follow */
import {
  followUser,
  unfollowUser,
  followStatus,
  myFollowers,
  myFollowing,
} from "../feature/follow/controller.js";

/* post */
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
} from "../feature/post/controller.js";

/* comment */
import {
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getReplies,
} from "../feature/comment/controller.js";

/* vote */
import {
  votePost,
  unvotePost,
  voteStatus,
  voteCount,
} from "../feature/vote/controller.js";

/* notification */
import {
  getNotifications,
  unreadCount,
  readNotification,
  readAllNotifications,
  deleteNotification,
} from "../feature/notification/controller.js";

/* chat */
import {
  sendMessage as sendChatMessage,
  getConversations,
  getChatWithUser,
  readChat,
  deleteChat,
} from "../feature/chat/controller.js";

/* group */
import {
  createGroup,
  getGroup,
  getMyGroups,
  joinGroup,
  leaveGroup,
  dissolveGroup,
  transferOwner,
  markGroupRead,
  sendGroupMessage,
  getGroupMessages,
} from "../feature/group/controller.js";

const router = Router();

/* system */
router.get("/health", (_, res) => res.json({ message: "ok" }));

/* auth */
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", requireAuth, me);

/* user */
router.get("/users/:userId", requireAuth, profileController);
router.patch("/users/me", requireAuth, updateProfile);
router.delete("/users/me", requireAuth, deleteMe);
router.get("/users/:userId/posts", requireAuth, getUserPostsController);

/* follow */
router.post("/follows/:userId", requireAuth, followUser);
router.delete("/follows/:userId", requireAuth, unfollowUser);
router.get("/follows/:userId/status", requireAuth, followStatus);
router.get("/follows/me/followers", requireAuth, myFollowers);
router.get("/follows/me/following", requireAuth, myFollowing);

/* post */
router.post("/posts", requireAuth, createPost);
router.get("/posts", requireAuth, getPosts);
router.get("/posts/me", requireAuth, getMyPosts);
router.get("/posts/:id", requireAuth, getPostById);
router.patch("/posts/:id", requireAuth, updatePost);
router.delete("/posts/:id", requireAuth, deletePost);

/* comment */
router.post("/comments", requireAuth, createComment);
router.get("/comments/:id", requireAuth, getComment);
router.patch("/comments/:id", requireAuth, updateComment);
router.delete("/comments/:id", requireAuth, deleteComment);
router.get("/comments/:id/replies", requireAuth, getReplies);

/* vote */
router.post("/votes", requireAuth, votePost);
router.delete("/votes/:postId", requireAuth, unvotePost);
router.get("/votes/:postId/status", requireAuth, voteStatus);
router.get("/votes/:postId/count", requireAuth, voteCount);

/* notification */
router.get("/notifications", requireAuth, getNotifications);
router.get("/notifications/unread-count", requireAuth, unreadCount);
router.patch("/notifications/:id/read", requireAuth, readNotification);
router.patch("/notifications/read-all", requireAuth, readAllNotifications);
router.delete("/notifications/:id", requireAuth, deleteNotification);

/* chat */
router.post("/chats", requireAuth, sendChatMessage);
router.get("/chats/conversations", requireAuth, getConversations);
router.get("/chats/:userId", requireAuth, getChatWithUser);
router.patch("/chats/:id/read", requireAuth, readChat);
router.delete("/chats/:id", requireAuth, deleteChat);

/* group */
router.post("/groups", requireAuth, createGroup);
router.get("/groups", requireAuth, getMyGroups);
router.get("/groups/:groupId", requireAuth, getGroup);
router.post("/groups/:groupId/join", requireAuth, joinGroup);
router.post("/groups/:groupId/leave", requireAuth, leaveGroup);
router.patch("/groups/:groupId/read", requireAuth, markGroupRead);
router.delete("/groups/:groupId", requireAuth, dissolveGroup);
router.patch("/groups/:groupId/transfer/:userId", requireAuth, transferOwner);

/* group message */
router.post("/groups/:groupId/messages", requireAuth, sendGroupMessage);
router.get("/groups/:groupId/messages", requireAuth, getGroupMessages);

export default router;
