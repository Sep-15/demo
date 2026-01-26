import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";
import { FollowButton } from "./FollowButton";

export const PostItem = ({ post, clickable = true }) => {
  const navigate = useNavigate();
  const goProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${post.author.id}`);
  };
  return (
    <div>
      <div
        onClick={clickable ? () => navigate(`/posts/${post.id}`) : undefined}
        className="cursor-pointer rounded-md bg-white p-4 shadow-sm hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <div className="cursor-pointer" onClick={goProfile}>
            <Avatar name={post.author?.name} size="sm" />
          </div>

          <div
            className="cursor-pointer text-sm text-gray-500 hover:underline"
            onClick={goProfile}
          >
            {post.author?.name ?? "不愿意透露姓名的用户"}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FollowButton id={post.author.id} />
          </div>
        </div>

        <div className="mt-1 text-gray-900">{post.content}</div>
        <div className="mt-2 text-xs  text-gray-400">
          👍{post.voteCount} · {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
