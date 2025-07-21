import React, { useState } from 'react';

export const FileUpload = ({ 
  onFileSelect, 
  accept = 'image/*', 
  label = '파일 선택',
  className = '',
  disabled = false 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div style={{ width: '100%' }} className={className}>
      <label style={{ 
        display: 'block', 
        fontSize: '14px', 
        fontWeight: '500', 
        color: '#374151', 
        marginBottom: '8px' 
      }}>
        {label}
      </label>
      <div
        style={{
          position: 'relative',
          border: `2px dashed ${dragActive ? '#f97316' : '#d1d5db'}`,
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          background: dragActive ? '#fef3c7' : 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
          disabled={disabled}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto',
            background: dragActive ? '#f97316' : '#9ca3af',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ 
              color: 'white', 
              fontSize: '24px', 
              fontWeight: 'bold' 
            }}>
              📷
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            <span style={{ 
              fontWeight: '500', 
              color: '#f97316',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}>
              클릭하여 파일 선택
            </span>
            {' '}또는 드래그 앤 드롭
          </div>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
            PNG, JPG, GIF 최대 10MB
          </p>
        </div>
      </div>
    </div>
  );
}; 