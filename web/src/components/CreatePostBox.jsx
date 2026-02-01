import { useState } from "react";
import { createPostApi } from "../api";

/* Cloudinary config */
const CLOUDINARY_CLOUD_NAME = "dhtthg8sf";
const CLOUDINARY_UPLOAD_PRESET = "simple_unsigned";

export const CreatePostBox = ({ onCreated }) => {
  const [content, setContent] = useState("");
  const [mediaList, setMediaList] = useState([]);
  // [{ file, type: "image" | "video", preview }]
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isEmpty = !content.trim() && mediaList.length === 0;

  /* 上传单个文件到 Cloudinary */
  const uploadToCloudinary = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const endpoint = type === "video" ? "video/upload" : "image/upload";

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${endpoint}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const text = await res.text(); // 不要直接 res.json
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Cloudinary raw response:", text);
      throw new Error("Cloudinary returned non-JSON response");
    }

    if (!res.ok) {
      console.error("Cloudinary error payload:", data);
      throw new Error(data?.error?.message || "Cloudinary upload failed");
    }

    return data;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (isEmpty || loading) return;

    setLoading(true);
    try {
      /* 并行上传所有媒体 */
      const uploadedMedia = await Promise.all(
        mediaList.map(async (m) => {
          const uploaded = await uploadToCloudinary(m.file, m.type);

          return {
            type: m.type,
            cloudinary: {
              public_id: uploaded.public_id,
              secure_url: uploaded.secure_url,
              width: uploaded.width,
              height: uploaded.height,
              format: uploaded.format,
              bytes: uploaded.bytes,
              duration: uploaded.duration, // video 才有
            },
          };
        }),
      );

      const payload = {
        content: content.trim(),
        media: uploadedMedia, // 直接存 JSON
      };

      const { data } = await createPostApi(payload);

      setContent("");
      setMediaList([]);
      setExpanded(false); // 提交后收起表单
      onCreated?.(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl bg-(--paper-card) p-5 shadow-sm space-y-3 border border-(--paper-border)"
    >
      {/* 默认只显示一行输入框，点击后展开 */}
      {!expanded ? (
        <div
          onClick={() => setExpanded(true)}
          className="w-full cursor-text rounded-lg border border-(--paper-border) p-3 text-base focus-within:ring-1 focus-within:ring-(--paper-accent) bg-(--paper-bg) text-(--paper-text) min-h-[44px] flex items-center"
        >
          <span className="text-(--paper-text-secondary)">写点什么…</span>
        </div>
      ) : (
        <>
          {/* 文本 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写点什么…"
            rows={3}
            autoFocus
            className="w-full resize-none rounded-lg border border-(--paper-border) p-3 text-base focus:outline-none focus:ring-1 focus:ring-(--paper-accent) bg-(--paper-bg) text-(--paper-text)"
          />

          {/* 多文件选择 */}
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;

              const next = files.map((file) => ({
                file,
                type: file.type.startsWith("video") ? "video" : "image",
                preview: URL.createObjectURL(file),
              }));

              setMediaList((prev) => [...prev, ...next]);
            }}
            className="block w-full text-base"
          />

          {/* 预览区 */}
          {mediaList.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {mediaList.map((m, i) => (
                <div key={i} className="relative rounded-lg border border-(--paper-border) bg-(--paper-bg) p-2">
                  {m.type === "image" ? (
                    <img
                      src={m.preview}
                      alt="preview"
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <video
                      src={m.preview}
                      controls
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setMediaList((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute right-2 top-2 rounded bg-(--paper-accent)/80 px-3 py-1 text-base text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 操作区 */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => {
                setContent("");
                setMediaList([]);
                if (!content.trim() && mediaList.length === 0) {
                  setExpanded(false); // 如果清空后没有内容，则收起表单
                }
              }}
              className="text-base text-(--paper-text-secondary) hover:text-(--paper-text)"
            >
              清空
            </button>

            <button
              type="submit"
              disabled={loading || isEmpty}
              className={[
                "rounded-lg px-5 py-2 text-base font-medium",
                loading || isEmpty
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : "bg-(--paper-accent) text-white hover:bg-(--paper-accent)/90",
              ].join(" ")}
            >
              {loading ? "发布中…" : "发布"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};
