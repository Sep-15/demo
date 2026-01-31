import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { getConversationsApi } from '../api';

export const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const value = useMemo(
    () => ({
      conversations,
      loading,
      fetchConversations,
      updateGroupLastMessage,
    }),
    [conversations, loading, fetchConversations, updateGroupLastMessage]
  );
  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};
