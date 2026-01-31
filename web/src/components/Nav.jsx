import { NavLink } from 'react-router-dom';

export const Nav = () => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-[var(--paper-bg)] border-b">
      <NavLink to="/" className="flex items-center gap-2 select-none">
        <span className="text-xl font-semibold tracking-tight text-[var(--paper-text)]">
          Room
        </span>
      </NavLink>
      <NavLink
        to="/conversations"
        className="flex items-center gap-2 select-none"
      >
        <span className="text-xl font-semibold tracking-tight text-[var(--paper-text)]">
          Conversation
        </span>
      </NavLink>
    </div>
  );
};
