import { useEffect, useRef } from 'react';
import { createContext, useState } from 'react';
import { unreadNotificationCountApi } from '../api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unread, setUnread] = useState(0);
  const { user } = useAuth();
  const initializedRef = useRef(false);
  const toastRef = useRef(0);
  const refreshUnread = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await unreadNotificationCountApi();
    setUnread(data.count);
  }, [user?.id]);
  useEffect(() => {
    refreshUnread().finally(() => (initializedRef.current = true));
  }, [refreshUnread]);
  const onNewNotification = useCallback(() => {
    setUnread((u) => {
      if (initializedRef.current && Date.now() - toastRef.current > 800) {
        toastRef.current = Date.now();
        toast('收到新的通知');
      }
      return u + 1;
    });
  }, []);
  const clearNotifications = useCallback(() => {
    refreshUnread();
  }, [refreshUnread]);
  return (
    <NotificationContext.Provider
      value={{ unread, refreshUnread, onNewNotification, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
