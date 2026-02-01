import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getConversationApi, sendMessageApi } from '../../api';
import { useConversation } from '../../hooks/useConversation';
import socket from '../../socket';
import { useUserSidebar } from '../../hooks/useUserSidebar';
import { useAuth } from '../../hooks/useAuth';

const ConversationPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { updateGroupLastMessage } = useConversation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const bottomRef = useRef(null);

  const { showUser } = useUserSidebar();
  useEffect(() => {
    if (loading) return;
    if (!data?.isGroup) {
      showUser(data?.sidebarId);
    }
  }, [showUser, data]);

  useEffect(() => {
    getConversationApi(id).then(({ data }) => {
      setData(data);
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const handler = (msg) => {
      if (Number(msg.groupId) !== Number(id)) return;
      setData((prev) => {
        if (!prev) return prev;
        if (prev.messages.some((m) => m.id === msg.id)) return prev;
        return {
          ...prev,
          messages: [
            ...prev.messages,
            { ...msg, isMe: msg.senderId === user.id },
          ],
        };
      });
      updateGroupLastMessage(Number(id), msg);
    };
    socket.on('message:new', handler);
    return () => socket.off('message:new', handler);
  }, [id, updateGroupLastMessage]);

  useEffect(() => {
    if (!data?.messages) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.messages]);

  const onClick = async () => {
    if (loading || !content.trim()) return;
    setLoading(true);
    try {
      await sendMessageApi(id, { content });
      setContent('');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if (!data) return <div className="p-4 text-center">Loading...</div>;
  return (
    <div className="flex flex-col min-h-screen bg-(--paper-bg)">
      <header className="block md:hidden p-4 border-b font-bold bg-(--paper-card) border-(--paper-border)">
        {data.title}
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-(--paper-bg)">
        {data.messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-[70%] ${m.isMe ? 'bg-(--paper-accent) text-(--paper-card)' : 'bg-(--paper-card) text-(--paper-text) border border-(--paper-border)'}`}
            >
              <div className="text-xs opacity-70 mb-1">{m.senderName}</div>
              <div>{m.content}</div>
              <div className="text-xs mt-1 text-right opacity-70">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>
      <footer className="flex-none p-4 border-t bg-(--paper-card) border-(--paper-border)">
        <div className="flex gap-2">
          <input
            className="flex-1 border border-(--paper-border) rounded px-3 py-2 outline-none focus:border-(--paper-accent) bg-(--paper-bg) text-(--paper-text)"
            placeholder="输入..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
          />
          <button
            className="bg-(--paper-accent) text-(--paper-card) px-4 py-2 rounded disabled:opacity-50"
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
