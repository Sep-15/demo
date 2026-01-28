import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfileApi } from "../api/index";
import { useAuth } from "../hooks/useAuth";
import { SidebarUserCard } from "../components/SidebarUserCard";
import { PostItem } from "../components/PostItem";

const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [posts, setPosts] = useState(null);
  const [tab, setTab] = useState("posts");
  useEffect(() => {
    getUserProfileApi(userId)
      .then(({ data }) => {
        setData(data);
        setPosts(data.posts);
      })
      .catch(console.error);
  }, [userId]);

  const me = user?.id && data?.user?.id && user.id === data.user.id;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="block md:hidden">
        <SidebarUserCard data={data} me={me} />
      </div>
      <div className="mt-6 flex gap-2 rounded-xl bg-[var(--paper-card)] p-1 border border-[var(--paper-border)]">
        <button
          onClick={() => {
            setTab("posts");
            setPosts(data.posts);
          }}
          className={[
            "flex-1 rounded-lg py-2 text-sm font-medium transition",
            tab === "posts"
              ? "bg-white text-[var(--paper-text)] shadow"
              : "text-[var(--paper-text-secondary)] hover:bg-[var(--paper-bg)]",
          ]}
        >
          创建的posts
        </button>
        <button
          onClick={() => {
            setTab("liked");
            setPosts(data.likedPosts);
          }}
          className={[
            "flex-1 rounded-lg py-2 text-sm font-medium transition",
            tab === "liked"
              ? "bg-white text-[var(--paper-text)] shadow"
              : "text-[var(--paper-text-secondary)] hover:bg-[var(--paper-bg)]",
          ]}
        >
          点赞的posts
        </button>
      </div>
      <div className="mt-6 space-y-4">
        {posts && posts.map((post) => <PostItem key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default ProfilePage;
