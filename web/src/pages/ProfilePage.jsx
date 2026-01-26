import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfileApi } from "../api/index";
import { useAuth } from "../hooks/useAuth";
import { FollowButton } from "../components/FollowButton";
import { PostListView } from "../components/PostListView";

const TABS = {
  POSTS: "posts",
  LIKED: "liked",
};

const ProfilePage = () => {
  const auth = useAuth();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let ignore = false;

    const fetchProfile = async () => {
      const { data } = await getUserProfileApi(userId);
      if (!ignore) {
        setProfile(data);
        setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      ignore = true;
    };
  }, [userId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!profile) return <div className="p-4">用户不存在</div>;

  const { user, counts, posts, likedPosts } = profile;
  const isSelf = auth.user && String(auth.user.id) === String(userId);

  const list = activeTab === TABS.POSTS ? posts : likedPosts;

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6">
      {/* Header */}
      <div className="mb-6 rounded-md bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-sm text-gray-500">{user.email}</p>

        {!isSelf && (
          <div className="mt-3">
            <FollowButton id={userId} variant="profile" />
          </div>
        )}

        <div className="mt-4 flex gap-6 text-sm">
          <span>
            <strong>{counts.followers}</strong> 被关注
          </span>
          <span>
            <strong>{counts.following}</strong> 关注中
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-4 border-b">
        <button
          onClick={() => setActiveTab(TABS.POSTS)}
          className={`pb-2 text-sm ${
            activeTab === TABS.POSTS
              ? "border-b-2 border-blue-600 font-medium"
              : "text-gray-500"
          }`}
        >
          发布的帖子
        </button>

        <button
          onClick={() => setActiveTab(TABS.LIKED)}
          className={`pb-2 text-sm ${
            activeTab === TABS.LIKED
              ? "border-b-2 border-blue-600 font-medium"
              : "text-gray-500"
          }`}
        >
          点赞过的帖子
        </button>
      </div>

      <PostListView posts={list} loading={false} hasMore={false} />
    </div>
  );
};

export default ProfilePage;
