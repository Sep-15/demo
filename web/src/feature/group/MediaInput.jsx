import { useState } from 'react';

export const MediaInput = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const nextMedia = files.map((file) => ({
      file,
      type: file.type.startsWith('video') ? 'video' : 'image',
      preview: URL.createObjectURL(file),
    }));
    setMediaList((prev) => [...prev, ...nextMedia]);
    e.target.value = '';
  };
  const removeMedia = (index) => {
    setMediaList((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((_, i) => i !== index);
    });
  };
  const submit = async (e) => {
    e.preventDefault();
    if (loading || mediaList.length === 0) return;
    setLoading(true);
    try {
      const results = await Promise.all(
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
              duration: uploaded.duration,
            },
          };
        })
      );
      onUploadSuccess?.(results);
      mediaList.forEach((m) => URL.revokeObjectURL(m.preview));
      setMediaList([]);
    } catch (error) {
      console.error('上传流程出错:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        {mediaList.map((m, i) => (
          <div key={i} className="relative w-20 h-20">
            {m.type === 'image' ? (
              <img
                src={m.preview}
                className="w-full h-full object-cover rounded shadow"
              />
            ) : (
              <video
                src={m.preview}
                className="w-full h-full object-cover rounded shadow"
              />
            )}
            <button
              onClick={() => removeMedia(i)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center shadow-lg "
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="text-sm text-(--paper-text-secondary)"
        />
        <button
          onClick={submit}
          disabled={loading || mediaList.length === 0}
          className="bg-(--paper-accent) text-white px-3 py-1 rounded disabled:opacity-50"
        >
          {loading ? '上传中...' : '确认发送媒体'}
        </button>
      </div>
    </div>
  );
};

async function uploadToCloudinary(file, type) {
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const PRESET = import.meta.env.VITE_PRESET;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', PRESET);
  const endpoint = type === 'video' ? 'video/upload' : 'image/upload';
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}`,
    { method: 'POST', body: formData }
  );
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    console.error('Cloudinary raw response:', text);
    throw new Error('Cloudinary returned non-JSON response');
  }
  if (!res.ok) {
    console.error('Cloudinary error payload:', data);
    throw new Error(data?.error?.message || 'Cloudinary upload failed');
  }
  return data;
}
