import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

export const CommentList = ({ postId, comments, onRefresh }) => {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-sm font-medium text-gray-700">
        comment:({comments.length})
      </h3>
      <CommentForm postId={postId} onSuccess={onRefresh} />
      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            level={0}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
};
