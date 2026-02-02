import { useNavigate } from 'react-router-dom';
import { useConversation } from '../../hooks/useConversation';

const ConversationsListPage = () => {
  const { conversations, loading } = useConversation();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="flex items-center justify-center bg-(--paper-bg)">
        Loading...
      </div>
    );
  return (
    <div className="flex flex-col  bg-(--paper-bg)">
      {conversations.length === 0 ? (
        <div className="m-auto p-10 text-center text-(--paper-text-secondary) bg-(--paper-card) rounded-xl">
          暂无对话
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/conversations/${c.id}`)}
              className=" relative flex flex-col p-4 gap-1 rounded-xl bg-(--paper-card) cursor-pointer transition-colors hover:bg-(--paper-bg)"
            >
              {c.hasUnread && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-(--paper-text)">
                  {c.title}
                </span>
                <span className="text-xs text-(--paper-text-secondary)">
                  {new Date(c.updatedAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm text-(--paper-text-secondary) truncate ">
                {c.lastMessage ? (
                  <>
                    <span className="mr-1">{c.lastMessage.senderName}:</span>
                    {c.lastMessage.content}
                  </>
                ) : (
                  <span className="italic">暂无消息</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ConversationsListPage;
