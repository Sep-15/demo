import { useCallback, useEffect, useState } from 'react';
import { getNotificationsApi } from '../api';
import socket from '../socket';
import { useNavigate } from 'react-router-dom';

export const NotificationPreview = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getNotificationsApi({ limite: 10 });
    setList(data);
    setLoading(false);
  });
  useEffect(() => {
    load();
    socket.on('notification:new', load);
    return () => socket.off('notification:new', load);
  }, []);

  const content = {
    FOLLOW: '关注了你',
    LIKE: '给你的帖子点赞',
    COMMENT: '评论了你的帖子',
    REPLY: '在帖子下回复了你',
    SYSTEM: '收到系统通知',
  };

  return (
    <div className="w-80 rounded-xl shadow-lg border bg-(--paper-bg) border-gray-200">
      <div className="px-4 py-3 border-b font-semibold text-sm">通知</div>

      {loading && <div className="p-4 text-sm text-gray-500">Loading...</div>}

      {!loading && list.length === 0 && (
        <div className="p-4 text-sm text-gray-500">暂无通知</div>
      )}

      <ul className="max-h-96 overflow-y-auto">
        {list.map((n) => (
          <li
            key={n.id}
            className="px-4 py-3 text-sm hover:bg-red-50 cursor-pointer border-b last:border-b-0"
          >
            <div className="flex gap-2">
              <span className="font-medium text-gray-900 whitespace-nowrap">
                {n.actor?.name || 某人}
              </span>
              <span className="text-gray-600">{content[n.type]}</span>
            </div>
          </li>
        ))}
      </ul>

      <div
        className="px-4 py-2 text-sm text-center text-blue-600 hover:underline cursor-pointer"
        onClick={() => navigate('/notifications')}
      >
        管理通知
      </div>
    </div>
  );
};
