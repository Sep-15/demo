import { useState } from "react";
import { Avatar } from "./Avatar";
import { CommentForm } from "./CommentForm";

export const CommentItem = ({ comment, postId, level, onRefresh }) => {
  const [showReply, setShowReply] = useState(false);
  const nextLevel = Math.min(level + 1, 2);

  return (
    <div
      className="pl-4 border-l border-gray-200"
      style={{ marginLeft: level * 12 }}
    >
      <div className="flex gap-2">
        <Avatar name={comment.author?.name} />

        <div className=" flex-1">
          <div className="text-xs text-gray-500">
            {comment.author?.name ?? "不愿意透露姓名的用户"}
            <span className="ml-2">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-800">{comment.content}</div>
          {level < 1 && (
            <button
              className="mt-1 text-xs text-blue-500 hover:underline"
              onClick={() => setShowReply((v) => !v)}
            >
              reply
            </button>
          )}
          {showReply && (
            <div className="mt-2">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onSuccess={() => {
                  setShowReply(false);
                  onRefresh();
                }}
              />
            </div>
          )}
        </div>
      </div>
      {comment.replies?.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              level={nextLevel}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
};
