import { useState, useEffect } from "react";
import { followStatusApi, followUserApi, unfollowUserApi } from "../api";
import { useFollow } from "../hooks/useFollow";

export const FollowButton = ({ id, variant = "post" }) => {
  const { followMap, setFollowing } = useFollow();
  const isFollowing = !!followMap[id];
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const fetchFollowingState = async () => {
    try {
      const { data } = await followStatusApi(id);
      setFollowing(id, data.isFollowing);
    } catch (error) {
      console.log(error);
    }
  };
  const toggleFollow = async () => {
    if (loading || !id) return;
    setLoading(true);
    try {
      if (!isFollowing) {
        await followUserApi(id);
        setFollowing(id, true);
      } else {
        await unfollowUserApi(id);
        setFollowing(id, false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setHover(false);
    }
  };
  useEffect(() => {
    if (!id) return;
    if (followMap[id] !== undefined) return;
    fetchFollowingState();
  }, [id, followMap, setFollowing]);
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-all select-none";

  const size = variant === "profile" ? "px-4 h-9 text-sm" : "px-3 h-7 text-xs";

  const followStyle =
    variant === "profile"
      ? "bg-black text-white hover:bg-neutral-800"
      : "border border-neutral-300 text-neutral-700 hover:bg-neutral-100";

  const followingStyle =
    variant === "profile"
      ? "border border-neutral-300 text-neutral-700 hover:border-red-400 hover:text-red-600"
      : "text-neutral-500 hover:text-red-600";

  const disabledStyle = "opacity-60 cursor-not-allowed";

  const className = [
    base,
    size,
    isFollowing ? followingStyle : followStyle,
    loading && disabledStyle,
  ]
    .filter(Boolean)
    .join(" ");
  function renderText() {
    if (loading) return "...";
    if (!isFollowing) return "Follow";
    if (hover) return "Unfollow";
    return "Following";
  }
  return (
    <button
      className={className}
      type="button"
      disabled={loading}
      onClick={toggleFollow}
      onMouseEnter={() => {
        isFollowing && setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      {renderText()}
    </button>
  );
};
