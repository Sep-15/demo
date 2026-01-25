import { useState, useEffect, useRef } from "react";
import { getPostsApi } from "../api/index";
import { PostItem } from "./PostItem";
const limit = 20;
export const PostList = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchedPagesRef = useRef(new Set());
  useEffect(() => {
    fetchPosts(page);
  }, [page]);
  const fetchPosts = async (page) => {
    if (loading || !hasMore) return;
    if (fetchedPagesRef.current.has(page)) return;
    fetchedPagesRef.current.add(page);
    setLoading(true);
    try {
      const { data } = await getPostsApi({ page, limit });
      setPosts((prev) => [...prev, ...data]);
      if (data.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
      {loading && (
        <div className="rounded-md bg-white p-4 text-sm text-gray-500 shadow-sm">
          loading...
        </div>
      )}
      {!loading && hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="w-full rounded-md bg-gray-100 py-2 text-sm hover:bg-gray-200"
        >
          show more
        </button>
      )}
      {!hasMore && (
        <div className="text-center text-xs text-gray-400">no more </div>
      )}
    </div>
  );
};
