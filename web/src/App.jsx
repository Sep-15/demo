// File: src/App.jsx
import { Suspense } from "react";
import { Outlet, NavLink } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 h-14 bg-white border-b">
        <div className="mx-auto max-w-[1280px] h-full flex items-center px-4">
          <div className="text-lg font-semibold">Room</div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] flex gap-4 px-4 py-4">
        <aside className="hidden md:block w-56 shrink-0">
          <NavLink
            to="/"
            className="block rounded-md bg-white p-4 shadow-sm cursor-pointer hover:bg-gray-50"
          >
            Home
          </NavLink>
        </aside>
        <main className="flex-1 min-w-0">
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default App;
