import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { getConversationsApi } from '../api';
import socket from '../socket';

export const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGroupId, setActiveGroupId] = useState(null);

  const fetchConversations = useCallback(() => {
    setLoading(true);
    getConversationsApi()
      .then(({ data }) => {
        setConversations(data);
      })
      .catch((err) => console.log('获取失败', err))
      .finally(() => setLoading(false));
  }, []);

  const updateGroupLastMessage = useCallback((groupId, lastMessage) => {
    setConversations((prev) => {
      const newconversations = prev.map((g) =>
        g.id === groupId
          ? { ...g, lastMessage, updatedAt: new Date().toISOString() }
          : g
      );
      return newconversations.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    });
  }, []);

  const markUnread = useCallback((groupId) => {
    setConversations((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, hasUnread: true } : g))
    );
  }, []);

  const clearUnread = useCallback((groupId) => {
    setConversations((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, hasUnread: false } : g))
    );
  }, []);

  const setActiveGroup = useCallback(
    (groupId) => {
      setActiveGroupId(groupId ? Number(groupId) : null);
      if (groupId) {
        clearUnread(Number(groupId));
        socket.emit('group:focus', { groupId: Number(groupId) });
      }
    },
    [clearUnread]
  );

  const clearActiveGroup = useCallback(() => {
    if (activeGroupId) {
      socket.emit('group:blur', { groupId: activeGroupId });
    }
    setActiveGroupId(null);
  }, [activeGroupId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const handler = (msg) => {
      const groupId = Number(msg.groupId);
      updateGroupLastMessage(groupId, msg);
      if (groupId !== activeGroupId) markUnread(groupId);
    };
    socket.on('message:new', handler);
    return () => socket.off('message:new', handler);
  }, [activeGroupId, updateGroupLastMessage, markUnread]);

  const value = useMemo(
    () => ({
      conversations,
      loading,
      activeGroupId,
      fetchConversations,
      updateGroupLastMessage,
      setActiveGroup,
      clearActiveGroup,
      markUnread,
      clearUnread,
    }),
    [
      conversations,
      loading,
      activeGroupId,
      fetchConversations,
      updateGroupLastMessage,
      setActiveGroup,
      clearActiveGroup,
      markUnread,
      clearUnread,
    ]
  );
  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};
