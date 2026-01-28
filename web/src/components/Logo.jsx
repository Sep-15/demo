import { NavLink } from "react-router-dom";

export const Logo = () => {
  return (
    <NavLink to="/" className="flex items-center gap-2 select-none">
      <span className="text-xl font-semibold tracking-tight text-[var(--paper-text)]">
        Room
      </span>
    </NavLink>
  );
};
