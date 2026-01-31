import { useAuth } from '../hooks/useAuth';
import { Avatar } from './Avatar';
import { Nav } from './Nav';
import { useNotification } from '../hooks/useNotification';
import { useEffect, useRef, useState } from 'react';
import { NotificationProview } from './NotificationPreview';

export const Header = () => {
  const { logout, user } = useAuth();
  const { unread } = useNotification();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // 点击外部关闭
  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-16 bg-[var(--paper-card)] border-b border-[var(--paper-border)] backdrop-blur">
      {user && (
        <div className="mx-auto max-w-7xl h-full flex items-center justify-between px-6">
          <Nav />

          <div className="flex items-center gap-3 rounded-full bg-[var(--paper-bg)] px-3 py-1.5">
            <Avatar name={user.name} size="sm" />
            <span className="text-sm font-medium text-gray-800 max-w-30 truncate">
              {user.name}
            </span>

            {/* 🔔 + 弹层必须在同一个 relative 容器 */}
            <div ref={wrapperRef} className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="relative text-lg cursor-pointer select-none"
              >
                🔔
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-80 z-50">
                  <NotificationProview />
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-gray-200" />
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-800 max-w-30 truncate"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
