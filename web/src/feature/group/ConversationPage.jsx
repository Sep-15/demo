import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getConversationApi, sendMessageApi, readGroupApi } from '../../api';
import { useConversation } from '../../hooks/useConversation';
import socket from '../../socket';
import { useUserSidebar } from '../../hooks/useUserSidebar';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../../components/Avatar';
import { MediaInput } from './MediaInput';
import { uploadToCloudinary } from '../../utils/uploadCloudinary';
import { useNotification } from '../../hooks/useNotification';

const ConversationPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const { updateGroupLastMessage, setActiveGroup, clearActiveGroup } =
    useConversation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [mediaList, setMediaList] = useState([]);
  const [preview, setPreview] = useState(null);
  const bottomRef = useRef(null);
  const { showUser } = useUserSidebar();
  const groupedMessages = useMemo(
    () => groupMessagesByDate(data?.messages ?? []),
    [data?.messages]
  );
  const { refreshUnread } = useNotification();

  useEffect(() => {
    if (!id) return;
    readGroupApi({ groupId: id }).then(() => refreshUnread());
  }, [refreshUnread, id]);

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

  const handleFileSelect = (files) => {
    const nextMedia = files.map((file) => ({
      file,
      type: file.type.startsWith('video') ? 'video' : 'image',
      preview: URL.createObjectURL(file),
    }));

    setMediaList((prev) => [...prev, ...nextMedia]);
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(mediaList[index].preview);
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (loading) return;

    const hasContent = content.trim();
    const hasMedia = mediaList.length > 0;
    if (!hasContent && !hasMedia) return;

    setLoading(true);
    try {
      if (hasMedia) {
        const uploadedMedia = await Promise.all(
          mediaList.map(async (m) => {
            const uploaded = await uploadToCloudinary(m.file, m.type);
            return {
              type: m.type,
              cloudinary: {
                public_id: uploaded.public_id,
                secure_url: uploaded.secure_url,
                width: uploaded.width,
                height: uploaded.height,
                format: uploaded.format,
                bytes: uploaded.bytes,
                duration: uploaded.duration,
              },
            };
          })
        );
        for (const item of uploadedMedia) {
          await sendMessageApi(id, { url: item });
        }
        mediaList.forEach((m) => URL.revokeObjectURL(m.preview));
        setMediaList([]);
      }

      if (hasContent) await sendMessageApi(id, { content });
      setContent('');
    } catch (error) {
      console.error('发送失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-(--paper-bg)">
      <header className=" text-center flex-none sticky z-10 top-16 block lg:hidden font-bold  bg-(--paper-bg)">
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
                  {m.url && (
                    <div
                      className="mb-2 rounded-md"
                      onClick={() =>
                        setPreview({
                          type: m.url.type,
                          url: m.url.cloudinary.secure_url,
                        })
                      }
                    >
                      {m.url.type === 'image' ? (
                        <img
                          src={m.url.cloudinary.secure_url}
                          alt="image"
                          className="max-w-full h-auto max-h-60 object-cover"
                        />
                      ) : (
                        <video
                          src={m.url.cloudinary.secure_url}
                          controls
                          className="max-w-full max-h-60"
                        />
                      )}
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
      <footer className="flex-none sticky bg-(--paper-bg) bottom-0 z-10 border-(--paper-border)">
        {mediaList.length > 0 && (
          <div className="px-4 py-3 animate-slide-up">
            <div className="flex gap-2 pb-2">
              {mediaList.map((m, i) => (
                <div key={i} className="relative shrink-0 w-20 h-20 group">
                  {m.type === 'image' ? (
                    <img
                      src={m.preview}
                      className="w-full h-full object-cover rounded-lg shadow-md "
                    />
                  ) : (
                    <video
                      src={m.preview}
                      controls
                      className="w-full h-full object-cover rounded-lg shadow-md "
                    />
                  )}
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center opacity-90 group-hover:opacity-100"
                  >
                    ×
                  </button>
                  {m.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-5">
          <input
            className="flex-1 border border-(--paper-border) rounded px-3 py-2 outline-none focus:border-(--paper-accent) bg-(--paper-bg) text-(--paper-text)"
            placeholder="输入..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <MediaInput onFileSelect={handleFileSelect} />
          <button
            className="bg-(--paper-accent) text-(--paper-card) px-4 py-2 rounded disabled:opacity-50"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? '...' : '发送'}
          </button>
        </div>
      </footer>
      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {preview.type === 'image' ? (
              <img
                src={preview.url}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              />
            ) : (
              <video
                src={preview.url}
                controls
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              />
            )}
            <button
              className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-200 transition-colors shadow-lg"
              onClick={() => setPreview(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
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
