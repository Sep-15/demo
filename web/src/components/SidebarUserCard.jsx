import { Avatar } from './Avatar';
import { FollowButton } from './FollowButton';
import { CreateConversationButton } from '../feature/group/CreateConversationButton';
import { useLocation, useNavigate } from 'react-router-dom';
export const SidebarUserCard = ({ data, me }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isConversationPage = location.pathname.startsWith('/conversations/');
  if (!data) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400">
        Loading...
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar name={data.user.name} />
        <div
          className="flex-1 min-w-0 hover:underline cursor-pointer"
          onClick={() => navigate(`/profile/${data.user.id}`)}
        >
          <div className="font-semibold text-gray-900 truncate">
            {data.user.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {data.user.email}
          </div>
        </div>

        {!me && <FollowButton id={data.user.id} />}
      </div>

      <div className="flex justify-around text-center">
        <div>
          <div className="text-base font-semibold text-gray-900">
            {data.counts.following}
          </div>
          <div className="text-xs text-gray-400">关注</div>
        </div>
        <div>
          <div className="text-base font-semibold text-gray-900">
            {data.counts.followers}
          </div>
          <div className="text-xs text-gray-400">粉丝</div>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        创建于{new Date(data.user.createdAt).toLocaleString()}
      </div>

      {!me && !isConversationPage && (
        <CreateConversationButton targetId={data.user.id} />
      )}
    </div>
  );
};
