import { useEffect, useState } from 'react';
import {
  getNotificationsApi,
  readNotificationApi,
  readAllNotificationsApi,
  deleteNotificationApi,
} from '../api';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import { useUserSidebar } from '../hooks/useUserSidebar';

export default function NotificationsPage() {
  const [list, setList] = useState([]);
  const { clearNotifications } = useNotification();

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
  }, []);

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
            className={`
              p-4 rounded-lg border
              ${n.isRead ? 'bg-white' : 'bg-blue-50'}
            `}
          >
            <div className="text-sm">
              <span className="font-medium">{n.actor?.name}</span> {n.type}
            </div>

            <div className="flex gap-4 mt-2 text-sm">
              {!n.isRead && (
                <button onClick={() => markRead(n.id)} className="text-blue-600">
                  标记已读
                </button>
              )}
              <button onClick={() => remove(n.id)} className="text-red-500">
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
