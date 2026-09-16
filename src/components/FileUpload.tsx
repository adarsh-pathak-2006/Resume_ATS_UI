'use client';

import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  selectedFile?: File | null;
}

export default function FileUpload({ onFileSelect, accept = '.pdf', selectedFile }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <div
        className={`file-upload ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="file-upload-icon">📎</div>
        <p className="file-upload-text">
          Drag & drop your resume PDF here, or <strong style={{ color: 'var(--accent-primary)' }}>browse</strong>
        </p>
        <p className="file-upload-hint">Supports PDF files up to 10MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>
      {selectedFile && (
        <div className="file-upload-selected">
          <span style={{ fontSize: '1.2rem' }}>📄</span>
          <span className="file-upload-selected-name">{selectedFile.name}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {(selectedFile.size / 1024).toFixed(1)} KB
          </span>
        </div>
      )}
    </div>
  );
}
