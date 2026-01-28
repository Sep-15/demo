// File: src/App.jsx
import { Suspense } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

const App = () => {
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
