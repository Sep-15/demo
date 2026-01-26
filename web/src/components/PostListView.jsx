import { PostItem } from "./PostItem";

export const PostListView = ({ posts, loading, hasMore, onLoadMore }) => {
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
          onClick={onLoadMore}
          className="w-full rounded-md bg-gray-100 py-2 text-sm hover:bg-gray-200"
        >
          show more
        </button>
      )}

      {!hasMore && (
        <div className="text-center text-xs text-gray-400">no more</div>
      )}
    </div>
  );
};
