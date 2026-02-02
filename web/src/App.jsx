// File: src/App.jsx
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { useAuth } from './hooks/useAuth';
import { useUserSidebar } from './hooks/useUserSidebar';
import socket from './socket';
import { useNotificationSocket } from './hooks/useNotificationSocket';

const App = () => {
  useNotificationSocket();
  const location = useLocation();
  const { user, token } = useAuth();
  const { showUser } = useUserSidebar();

  useEffect(() => {
    if (!user?.id || !token) {
      socket.disconnect();
      return;
    }
    socket.auth = { token };
    if (!socket.connected) socket.connect();
  }, [user?.id, token]);

  useEffect(() => {
    const home = location.pathname === '/';
    if (home) showUser(user.id);
  }, [location.pathname, user?.id, showUser]);

  return (
    <div className="min-h-screen flex flex-col  bg-(--paper-bg)">
      <Header />

      <div className="lg:max-w-7xl mx-auto w-full flex lg:gap-6 px-6 py-2 lg:pr-88  ">
        <main className="flex-1 min-w-0 ">
          <Suspense fallback={<div className="p-4 text-lg">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
        <Sidebar />
      </div>
    </div>
  );
};

export default App;
