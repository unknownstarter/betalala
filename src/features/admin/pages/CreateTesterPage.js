import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin.js';

export const CreateTesterPage = () => {
  const navigate = useNavigate();
  const { createTester, loading, error, clearError } = useAdmin();
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user',
    status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    const success = await createTester(formData);
    if (success) {
      alert('테스터가 성공적으로 생성되었습니다!');
      navigate('/admin/users');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modern-dashboard">
      <h1 className="dashboard-title">새 테스터 등록</h1>
      <p className="dashboard-subtitle">
        새로운 테스터를 등록하고 초대 이메일을 발송합니다.
      </p>

      {error && (
        <div className="modern-error" style={{ marginBottom: '20px' }}>
          {error}
          <button 
            onClick={clearError}
            style={{ 
              marginLeft: '10px', 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer' 
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="modern-card-dashboard" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white', 
              fontWeight: '500' 
            }}>
              이메일 *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="test@example.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#1f2937',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white', 
              fontWeight: '500' 
            }}>
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="테스터 이름"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#1f2937',
                color: 'white',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white', 
              fontWeight: '500' 
            }}>
              역할
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#1f2937',
                color: 'white',
                fontSize: '16px'
              }}
            >
              <option value="user">일반 테스터</option>
              <option value="admin">관리자</option>
            </select>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white', 
              fontWeight: '500' 
            }}>
              상태
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #374151',
                background: '#1f2937',
                color: 'white',
                fontSize: '16px'
              }}
            >
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #6b7280',
                background: '#6b7280',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #3b82f6',
                background: '#3b82f6',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '생성 중...' : '테스터 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 