import { useState, useEffect, useRef } from "react";
import { getPostsApi } from "../api/index";
import { PostListView } from "./PostListView";
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
    <PostListView
      posts={posts}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={() => setPage((p) => p + 1)}
    />
  );
};
