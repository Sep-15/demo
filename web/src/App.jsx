// File: src/App.jsx
import { Suspense } from "react";
import { Outlet, NavLink } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen bg-[var(--paper-bg)]">
      <header className="sticky top-0 z-50 h-16 bg-[var(--paper-card)] border-b border-[var(--paper-border)] shadow-sm">
        <div className="mx-auto max-w-[1280px] h-full flex items-center px-6">
          <div className="text-xl font-bold text-[var(--paper-text)]">Room</div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] flex gap-6 px-6 py-6">
        <aside className="hidden md:block w-64 shrink-0 bg-[var(--paper-card)] rounded-xl border border-[var(--paper-border)] shadow-sm p-4">
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block rounded-lg p-4 text-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--paper-accent)] text-white"
                    : "text-[var(--paper-text)] hover:bg-[var(--paper-bg)]"
                }`
              }
            >
              Back
            </NavLink>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          <Suspense fallback={<div className="p-4 text-lg">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default App;
