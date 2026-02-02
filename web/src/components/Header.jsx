import { useAuth } from '../hooks/useAuth';
import { Avatar } from './Avatar';
import { Nav } from './Nav';
import { useNotification } from '../hooks/useNotification';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { logout, user } = useAuth();
  const { unread } = useNotification();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 h-16 bg-(--paper-card) border-b border-(--paper-border) backdrop-blur">
      {user && (
        <div className="mx-auto max-w-7xl h-full flex items-center justify-between px-6">
          <div className="flex items-center">
            <Nav />
          </div>

          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate(`/profile/${user.id}`)}
              className="flex items-center gap-1 cursor-pointer hover:bg-(--paper-bg)"
            >
              <Avatar name={user.name} size="sm" />
              <span className="text-sm font-medium text-gray-800 max-w-30 truncate">
                {user.name}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => navigate('/notifications')}
                className="relative text-lg cursor-pointer select-none"
              >
                🔔
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
            </div>

            <div className="h-4 w-px bg-gray-200" />
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-800 max-w-30 truncate cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
