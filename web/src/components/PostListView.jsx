import { PostItem } from "./PostItem";

export const PostListView = ({ posts, loading, hasMore, onLoadMore }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}

      {loading && (
        <div className="rounded-xl bg-[var(--paper-card)] p-5 text-base text-[var(--paper-text-secondary)] shadow-sm border border-[var(--paper-border)]">
          loading...
        </div>
      )}

      {!loading && hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full rounded-xl bg-[var(--paper-bg)] py-3 text-base hover:bg-[var(--paper-card)] border border-[var(--paper-border)] text-[var(--paper-text)]"
        >
          show more
        </button>
      )}

      {!hasMore && (
        <div className="text-center text-sm text-[var(--paper-text-secondary)] py-2">no more</div>
      )}
    </div>
  );
};
