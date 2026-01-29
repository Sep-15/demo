// src/hooks/useNotificationSocket.js
import { useEffect } from 'react';
import socket from '../socket';
import { useNotification } from './useNotification';

export const useNotificationSocket = () => {
  const { onNewNotification } = useNotification();

  useEffect(() => {
    const handler = () => {
      onNewNotification();
    };

    socket.on('notification:new', handler);

    return () => {
      socket.off('notification:new', handler);
    };
  }, []);
};
