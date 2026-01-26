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
      className="rounded-md bg-white p-4 shadow-sm space-y-3"
    >
      {/* 文本 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="写点什么…"
        rows={3}
        className="w-full resize-none rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
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
        className="block w-full text-sm"
      />

      {/* 预览区 */}
      {mediaList.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {mediaList.map((m, i) => (
            <div key={i} className="relative rounded-md border bg-gray-50 p-1">
              {m.type === "image" ? (
                <img
                  src={m.preview}
                  alt="preview"
                  className="h-40 w-full rounded-md object-cover"
                />
              ) : (
                <video
                  src={m.preview}
                  controls
                  className="h-40 w-full rounded-md object-cover"
                />
              )}

              <button
                type="button"
                onClick={() =>
                  setMediaList((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute right-1 top-1 rounded bg-black/70 px-2 py-0.5 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 操作区 */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => {
            setContent("");
            setMediaList([]);
          }}
          className="text-sm text-gray-500 hover:text-black"
        >
          清空
        </button>

        <button
          type="submit"
          disabled={loading || isEmpty}
          className={[
            "rounded-md px-4 py-1.5 text-sm font-medium",
            loading || isEmpty
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-black text-white hover:bg-neutral-800",
          ].join(" ")}
        >
          {loading ? "发布中…" : "发布"}
        </button>
      </div>
    </form>
  );
};
