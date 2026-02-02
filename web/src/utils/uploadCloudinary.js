export async function uploadToCloudinary(file, type) {
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
