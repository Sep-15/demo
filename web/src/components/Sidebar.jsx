import { useUserSidebar } from "../hooks/useUserSidebar";
import { SidebarUserCard } from "./SidebarUserCard";

export const Sidebar = () => {
  const { displayData } = useUserSidebar();
  return (
    <aside className=" hidden md:block w-80 shrink-0 space-y-4">
      <div className="bg-[var(--paper-card)] rounded-2xl shadow-md p-4">
        <SidebarUserCard data={displayData} />
      </div>
    </aside>
  );
};
