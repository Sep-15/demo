import { useAuth } from '../hooks/useAuth';
import { useUserSidebar } from '../hooks/useUserSidebar';
import { SidebarUserCard } from './SidebarUserCard';

export const Sidebar = () => {
  const { displayData } = useUserSidebar();
  const { user } = useAuth();
  const me =
    user?.id && displayData?.user?.id && user.id === displayData.user.id;
  return (
    <aside className="hidden lg:block fixed top-24 w-80 right-[clamp(1.5rem,(100vw-80rem)/2,3rem)]">
      <div className="bg-(--paper-card) rounded-2xl shadow-md p-4">
        <SidebarUserCard data={displayData} me={me} />
      </div>
    </aside>
  );
};
