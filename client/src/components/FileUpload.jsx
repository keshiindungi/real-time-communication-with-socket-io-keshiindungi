import React from 'react';

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onFileUpload({
        name: file.name,
        type: file.type,
        size: file.size,
        data: event.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx"
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input" className="file-upload-label">
        📎 Attach File
      </label>
    </div>
  );
};

export default FileUpload;