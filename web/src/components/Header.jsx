import { useAuth } from "../hooks/useAuth";
import { Avatar } from "./Avatar";
import { Logo } from "./Logo";

export const Header = () => {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 h-16 bg-[var(--paper-card)] border-b border-[var(--paper-border)] backdrop-blur">
      {user && (
        <div className="mx-auto max-w-[1280px] h-full flex items-center justify-between px-6">
          <Logo />
          <div className=" flex items-center gap-3 rounded-full bg-[var(--paper-bg)] px-3 py-1.5">
            <Avatar name={user.name} size="sm" />
            <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
              {user.name}
            </span>
            <div className="h-4 w-px bg-gray-200" />
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-800 max-w-[120px] truncate"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
