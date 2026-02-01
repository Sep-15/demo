import { PostItem } from "./PostItem";

export const PostListView = ({ posts, loading, hasMore, onLoadMore }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}

      {loading && (
        <div className="rounded-xl bg-(--paper-card) p-5 text-base text-(--paper-text-secondary) shadow-sm border border-(--paper-border)">
          loading...
        </div>
      )}

      {!loading && hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full rounded-xl bg-(--paper-bg) py-3 text-base hover:bg-(--paper-card) border border-(--paper-border) text-(--paper-text)"
        >
          show more
        </button>
      )}

      {!hasMore && (
        <div className="text-center text-sm text-(--paper-text-secondary) py-2">no more</div>
      )}
    </div>
  );
};
