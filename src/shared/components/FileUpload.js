import React, { useState } from 'react';

export const FileUpload = ({ 
  onFileSelect, 
  accept = 'image/*', 
  label = '파일 선택',
  className = '',
  disabled = false,
  selectedFile = null
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
      
      {/* 선택된 파일이 있을 때 */}
      {selectedFile && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#10b981', fontSize: '16px' }}>📷</span>
            <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>
              {selectedFile.name}
            </span>
            <span style={{ color: '#10b981', fontSize: '12px' }}>
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            style={{
              background: 'transparent',
              border: '1px solid #10b981',
              color: '#10b981',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#10b981';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#10b981';
            }}
          >
            변경
          </button>
        </div>
      )}
      
      {/* 연한 회색 박스 컨테이너 */}
      <div
        style={{
          position: 'relative',
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          boxShadow: dragActive ? '0 4px 12px rgba(249, 115, 22, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          borderColor: dragActive ? '#f97316' : '#e9ecef',
          display: selectedFile ? 'none' : 'block'
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
        
        {/* 카메라 아이콘과 텍스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: dragActive ? '#f97316' : '#6c757d',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            marginTop: '20px'
          }}>
            <span style={{ 
              color: 'white', 
              fontSize: '32px', 
              fontWeight: 'bold' 
            }}>
              📷
            </span>
          </div>
          
          <div style={{ fontSize: '16px', color: '#495057', marginTop: '8px' }}>
            <span style={{ 
              fontWeight: '600', 
              color: '#f97316',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}>
              클릭하여 파일 선택
            </span>
            {' '}또는 드래그 앤 드롭
          </div>
          
          <p style={{ fontSize: '14px', color: '#6c757d', margin: '8px 0 0 0' }}>
            PNG, JPG, GIF 최대 10MB
          </p>
        </div>
      </div>
    </div>
  );
}; 