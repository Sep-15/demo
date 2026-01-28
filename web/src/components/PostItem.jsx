import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";
import { FollowButton } from "./FollowButton";
import { VoteButton } from "./VoteButton";
import { useUserSidebar } from "../hooks/useUserSidebar";

export const PostItem = ({ post, clickable = true }) => {
  const navigate = useNavigate();
  const { showUser } = useUserSidebar();
  const [preview, setPreview] = useState(null); // { type, url }

  const onClickPost = () => {
    showUser(post.author.id);
    navigate(`/posts/${post.id}`);
  };

  const goProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${post.author.id}`);
  };

  return (
    <>
      <div>
        <div
          onClick={clickable ? onClickPost : undefined}
          className="cursor-pointer rounded-xl bg-[var(--paper-card)] p-5 shadow-sm hover:bg-[var(--paper-bg)] border border-[var(--paper-border)]"
        >
          {/* header */}
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={goProfile}>
              <Avatar name={post.author?.name} size="md" />
            </div>

            <div
              className="cursor-pointer text-base text-[var(--paper-text-secondary)] hover:underline"
              onClick={goProfile}
            >
              {post.author?.name ?? "不愿意透露姓名的用户"}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <FollowButton id={post.author.id} />
            </div>
          </div>

          {/* content */}
          {post.content && (
            <div className="mt-2 whitespace-pre-wrap text-[var(--paper-text)] text-base">
              {post.content}
            </div>
          )}

          {/* media */}
          {Array.isArray(post.media) && post.media.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {post.media.map((m, idx) => {
                const url = m.cloudinary?.secure_url;
                if (!url) return null;

                return (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview({ type: m.type, url });
                    }}
                    className="overflow-hidden rounded-xl border border-[var(--paper-border)] bg-[var(--paper-bg)]"
                  >
                    {m.type === "image" ? (
                      <img
                        src={url}
                        alt=""
                        loading="lazy"
                        className="max-h-[280px] w-full object-cover"
                      />
                    ) : (
                      <video
                        src={url}
                        preload="metadata"
                        className="max-h-[280px] w-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* footer */}
          <div className="mt-3 flex items-center gap-4 text-sm text-[var(--paper-text-secondary)]">
            <VoteButton
              postId={post.id}
              initialLiked={post.isLiked}
              initialCount={post.voteCount}
            />
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ===== Lightbox ===== */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {preview.type === "image" ? (
              <img
                src={preview.url}
                alt=""
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            ) : (
              <video
                src={preview.url}
                controls
                autoPlay
                className="max-h-[90vh] max-w-[90vw]"
              />
            )}

            {/* close */}
            <button
              onClick={() => setPreview(null)}
              className="absolute -right-3 -top-3 rounded-full bg-white px-3 py-1 text-base"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};
