import { NavLink } from 'react-router-dom';

export const Nav = () => {
  return (
    <nav className="flex items-center space-x-1">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-(--paper-card) text-(--paper-text) shadow-sm'
              : 'text-gray-600 hover:text-(--paper-text) hover:bg-(--paper-bg)'
          }`
        }
      >
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block">Room</span>
          <span className="sm:hidden">🏠</span>
        </div>
      </NavLink>

      <NavLink
        to="/conversations"
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-(--paper-card) text-(--paper-text) shadow-sm'
              : 'text-gray-600 hover:text-(--paper-text) hover:bg-(--paper-bg)'
          }`
        }
      >
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block">Conversation</span>
          <span className="sm:hidden">💬</span>
        </div>
      </NavLink>
    </nav>
  );
};
