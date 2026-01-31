import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getConversationApi, sendMessageApi } from '../../api';
import { useConversation } from '../../hooks/useConversation';

const ConversationPage = () => {
  const { id } = useParams();
  const { updateGroupLastMessage } = useConversation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  useEffect(() => {
    getConversationApi(id).then(({ data }) => {
      setData(data);
    });
  }, [id]);
  const onClick = async () => {
    if (loading || !content.trim()) return;
    setLoading(true);
    try {
      const { data: newMessage } = await sendMessageApi(id, { content });
      setData((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
      updateGroupLastMessage(Number(id), newMessage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if (!data) return <div className="p-4 text-center">Loading...</div>;
  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b font-bold">{data.title}</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {data.messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-[70%] ${m.isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              <div className="text-xs opacity-70 mb-1">{m.senderName}</div>
              <div>{m.content}</div>
              <div className="text-3 mt-1 text-right">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
      </main>
      <footer className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 outline-none focus:border-blue-500"
            placeholder="输入..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            onClick={onClick}
            disabled={loading}
          >
            {loading ? '...' : '发送'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ConversationPage;
