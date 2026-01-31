import { useNavigate } from 'react-router-dom';
import { useConversation } from '../../hooks/useConversation';
const ConversationsListPage = () => {
  const { conversations, loading } = useConversation();
  const navigate = useNavigate();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {conversations.length === 0 ? (
        <div className="p-10 text-center text-gray-400">暂无对话</div>
      ) : (
        conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/conversations/${c.id}`)}
            className="flex flex-col p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">{c.title}</span>
              <span className="text-xs text-gray-400">
                {new Date(c.updatedAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm text-gray-500 truncate mt-1">
              {c.lastMessage ? (
                <>
                  <span className="text-gray-400">
                    {c.lastMessage.senderName}:{' '}
                  </span>
                  {c.lastMessage.content}
                </>
              ) : (
                <span className="italic text-gray-300">暂无消息</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default ConversationsListPage;
