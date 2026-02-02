import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getNotificationsApi,
  readNotificationApi,
  readAllNotificationsApi,
  deleteNotificationApi,
} from '../api';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import { useUserSidebar } from '../hooks/useUserSidebar';

const NotificationsPage = () => {
  const [list, setList] = useState([]);
  const { clearNotifications, unread } = useNotification();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { showUser } = useUserSidebar();
  useEffect(() => {
    if (user?.id) {
      showUser(user.id);
    }
  }, [user?.id, showUser]);

  const load = async () => {
    const { data } = await getNotificationsApi();
    setList(data);
  };

  useEffect(() => {
    load();
    clearNotifications();
  }, [unread]);

  const markRead = async (id) => {
    await readNotificationApi(id);
    load();
  };

  const markAllRead = async () => {
    await readAllNotificationsApi();
    load();
  };

  const remove = async (id) => {
    await deleteNotificationApi(id);
    load();
  };
  const content = {
    FOLLOW: '关注了你',
    LIKE: '点赞了你的帖子',
    COMMENT: '评论了你的帖子',
    REPLY: '回复了你',
    SYSTEM: '系统通知',
  };

  const handleJump = (n) => {
    const routes = {
      CONVERSATION: `/conversations/${n.groupId}`,
      FOLLOW: `/profile/${n.actorId}`,
      LIKE: `/posts/${n.postId}`,
      COMMENT: `/posts/${n.postId}`,
      REPLY: `/posts/${n.postId}`,
    };
    const path = routes[n.type] || '/notifications';
    if (!n.isRead) markRead(n.id);
    navigate(path);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">通知</h1>
        <button onClick={markAllRead} className="text-sm text-blue-600">
          全部已读
        </button>
      </div>

      <ul className="space-y-2">
        {list.map((n) => (
          <li
            key={n.id}
            onClick={() => handleJump(n)}
            className={`
              p-4 rounded-lg border
              ${n.isRead ? 'bg-white' : 'bg-blue-50'}
            `}
          >
            <div className="text-sm">
              <span className="font-medium">{n.actor?.name}</span>
              {': '}
              {n.content || content[n.type] || '视频/图片'}
            </div>

            <div className="flex gap-4 mt-2 text-sm">
              {!n.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markRead(n.id);
                  }}
                  className="text-blue-600"
                >
                  标记已读
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(n.id);
                }}
                className="text-red-500"
              >
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
