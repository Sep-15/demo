import { useState } from "react";
import { createCommentApi } from "../api";

export const CommentForm = ({ postId, parentId = null, onSuccess }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createCommentApi({ postId, parentId, content });
      setContent("");
      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        placeholder="comment"
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <div className="flex justify-end">
        <button
          disabled={loading}
          onClick={submit}
          className="rounded-md bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600 disabled:opacity-50"
        >
          submit
        </button>
      </div>
    </div>
  );
};
