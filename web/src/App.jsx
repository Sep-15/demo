// File: src/App.jsx
import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { useAuth } from "./hooks/useAuth";
import { useUserSidebar } from "./hooks/useUserSidebar";

const App = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { showUser } = useUserSidebar();

  useEffect(() => {
    const is =
      location.pathname.startsWith("/posts/") ||
      location.pathname.startsWith("/profile/");
    if (!is && user?.id) showUser(user.id);
  }, [location.pathname, user?.id]);

  return (
    <div className="min-h-screen bg-[var(--paper-bg)]">
      <Header />

      <div className="mx-auto max-w-[1280px] flex gap-6 px-6 py-6">
        <main className="flex-1 min-w-0">
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
