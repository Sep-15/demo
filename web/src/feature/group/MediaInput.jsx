export const MediaInput = ({ onFileSelect }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files === 0) return;
    onFileSelect(files);
    e.target.value = '';
  };

  return (
    <label className="flex items-center justify-center">
      ➕
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );
};
