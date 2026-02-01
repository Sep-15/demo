import { useNavigate } from 'react-router-dom';
import { useConversation } from '../../hooks/useConversation';
const ConversationsListPage = () => {
  const { conversations, loading } = useConversation();
  const navigate = useNavigate();
  if (loading) return <div className="p-10 text-center bg-(--paper-bg)">Loading...</div>;
  return (
    <div className="flex flex-col divide-y divide-(--paper-border) min-h-screen bg-(--paper-bg)">
      {conversations.length === 0 ? (
        <div className="p-10 text-center text-(--paper-text-secondary) bg-(--paper-card) m-4 rounded-xl">暂无对话</div>
      ) : (
        conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/conversations/${c.id}`)}
            className="flex flex-col p-4 hover:bg-(--paper-bg) cursor-pointer transition-colors border-b border-(--paper-border) bg-(--paper-card) m-4 rounded-xl"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-(--paper-text)">{c.title}</span>
              <span className="text-xs text-(--paper-text-secondary)">
                {new Date(c.updatedAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm text-(--paper-text-secondary) truncate mt-1">
              {c.lastMessage ? (
                <>
                  <span className="text-(--paper-text-secondary)">
                    {c.lastMessage.senderName}:{' '}
                  </span>
                  {c.lastMessage.content}
                </>
              ) : (
                <span className="italic text-(--paper-text-secondary)">暂无消息</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default ConversationsListPage;
