import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getConversationApi, sendMessageApi } from '../../api';
import { useConversation } from '../../hooks/useConversation';
import socket from '../../socket';
import { useUserSidebar } from '../../hooks/useUserSidebar';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../../components/Avatar';

const ConversationPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { updateGroupLastMessage, setActiveGroup, clearActiveGroup } =
    useConversation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const bottomRef = useRef(null);
  const { showUser } = useUserSidebar();
  const groupedMessages = useMemo(
    () => groupMessagesByDate(data?.messages ?? []),
    [data?.messages]
  );

  useEffect(() => {
    if (id) setActiveGroup(id);
    return () => clearActiveGroup();
  }, [id, setActiveGroup, clearActiveGroup]);

  useEffect(() => {
    if (loading) return;
    if (!data?.isGroup) {
      showUser(data?.sidebarId);
    }
  }, [showUser, data, loading]);

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
  }, [id, user.id, updateGroupLastMessage]);

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
    <div className="flex flex-col bg-(--paper-bg)">
      <header className=" text-center flex-none sticky z-10 bg-(--paper-bg) top-0 block lg:hidden font-bold">
        {data.title}
      </header>
      <main className="flex-1 p-4 space-y-4">
        {groupedMessages.map(([date, messages]) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-(--paper-border)" />
              <span className="text-xs text-(--paper-muted)">{date}</span>
              <div className="flex-1 h-px bg-(--paper-border)" />
            </div>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${m.isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className="shrink-0">
                  <Avatar name={m.senderName} />
                </div>

                <div
                  className={`flex items-baseline gap-4 p-3 rounded-lg max-w-[70%] ${m.isMe ? 'bg-(--paper-accent) text-(--paper-card)' : 'bg-(--paper-card) text-(--paper-text) border border-(--paper-border)'}`}
                >
                  {!m.isMe && data.isGroup && (
                    <div className="text-xs opacity-70 mb-1">
                      {m.senderName}
                    </div>
                  )}
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
          </div>
        ))}

        <div ref={bottomRef} />
      </main>
      <footer className="flex-none sticky bg-(--paper-bg) bottom-0 z-10 border-t border-(--paper-border)">
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

function groupMessagesByDate(messages) {
  const map = new Map();
  messages.forEach((m) => {
    const dateKey = new Date(m.createdAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey).push(m);
  });
  return Array.from(map.entries());
}
