import { useEffect, useState } from "react";
import { unvotePostApi, votePostApi } from "../api";

export const VoteButton = ({ postId, initialLiked, initialCount }) => {
  const [liked, setLiked] = useState(!!initialLiked);
  const [count, setCount] = useState(initialCount ?? 0);
  const [loading, setLoading] = useState(false);
  const toggleLike = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLiked(!liked);
    setCount((c) => (liked ? c - 1 : c + 1));
    try {
      if (!liked) {
        await votePostApi(postId);
      } else {
        await unvotePostApi(postId);
      }
    } catch (error) {
      console.log(error);
      setLiked(liked);
      setCount((c) => (liked ? c + 1 : c - 1));
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={loading}
      className={[
        "inline-flex items-center gap-1 text-xs select-none",
        liked ? "text-red-500" : "text-gray-400 hover:text-gray-600",
        loading && "opacity-60 cursor-not-allowed",
      ].join(" ")}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{count}</span>
    </button>
  );
};
