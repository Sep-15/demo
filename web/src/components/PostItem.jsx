import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";

export const PostItem = ({ post }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        onClick={() => navigate(`/post/${post.id}`)}
        className="cursor-pointer rounded-md bg-white p-4 shadow-sm hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <Avatar name={post.author?.name} size="sm" />
          <div className="text-sm text-gray-500">
            {post.author?.name ?? "不愿意透露姓名的用户"}
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
