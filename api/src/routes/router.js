// File: src/routes/router.js
import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import * as auth from '../feature/auth/controller.js';
import * as user from '../feature/user/controller.js';
import * as follow from '../feature/follow/controller.js';
import * as post from '../feature/post/controller.js';
import * as comment from '../feature/comment/controller.js';
import * as vote from '../feature/vote/controller.js';
import * as notification from '../feature/notification/controller.js';
import * as conversation from '../feature/group/controller.js';

const router = Router();

router.get('/health', (_, res) => res.json({ message: 'ok' }));

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', requireAuth, auth.me);

router.get('/users/:userId', requireAuth, user.profileController);
router.patch('/users/me', requireAuth, user.updateProfile);
router.delete('/users/me', requireAuth, user.deleteMe);
router.get('/users/:userId/posts', requireAuth, user.getUserPostsController);

router.post('/follows/:userId', requireAuth, follow.followUser);
router.delete('/follows/:userId', requireAuth, follow.unfollowUser);
router.get('/follows/:userId/status', requireAuth, follow.followStatus);
router.get('/follows/me/followers', requireAuth, follow.myFollowers);
router.get('/follows/me/following', requireAuth, follow.myFollowing);

router.post('/posts', requireAuth, post.createPost);
router.get('/posts', requireAuth, post.getPosts);
router.get('/posts/me', requireAuth, post.getMyPosts);
router.get('/posts/:id', requireAuth, post.getPostById);
router.patch('/posts/:id', requireAuth, post.updatePost);
router.delete('/posts/:id', requireAuth, post.deletePost);

router.post('/comments', requireAuth, comment.createComment);
router.get('/comments/:id', requireAuth, comment.getComment);
router.patch('/comments/:id', requireAuth, comment.updateComment);
router.delete('/comments/:id', requireAuth, comment.deleteComment);
router.get('/comments/:id/replies', requireAuth, comment.getReplies);

router.post('/votes', requireAuth, vote.votePost);
router.delete('/votes/:postId', requireAuth, vote.unvotePost);
router.get('/votes/:postId/status', requireAuth, vote.voteStatus);
router.get('/votes/:postId/count', requireAuth, vote.voteCount);

router.get('/notifications', requireAuth, notification.getNotifications);
router.get(
  '/notifications/unread-count',
  requireAuth,
  notification.unreadCount
);
router.patch(
  '/notifications/:id/read',
  requireAuth,
  notification.readNotification
);
router.patch('/notifications/read-group', requireAuth, notification.readGroup);
router.patch('/notifications/read-post', requireAuth, notification.readPost);
router.patch(
  '/notifications/read-all',
  requireAuth,
  notification.readAllNotifications
);
router.delete(
  '/notifications/:id',
  requireAuth,
  notification.deleteNotification
);

router.post('/conversations', requireAuth, conversation.createConversation);
router.get('/conversations', requireAuth, conversation.getConversations);
router.post('/conversations/:id', requireAuth, conversation.sendMessage);
router.get('/conversations/:id', requireAuth, conversation.getConversation);

export default router;
