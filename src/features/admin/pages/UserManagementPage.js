import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin.js';

export const UserManagementPage = () => {
  const navigate = useNavigate();
  const { 
    users, 
    loading, 
    error, 
    fetchUsers, 
    updateUserRole, 
    updateUserStatus, 
    deleteUser,
    clearError 
  } = useAdmin();

  const [currentPage] = useState(1);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    email: ''
  });

  useEffect(() => {
    fetchUsers(currentPage, 10, filters);
  }, [currentPage, filters, fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      alert('사용자 역할이 변경되었습니다.');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    const success = await updateUserStatus(userId, newStatus);
    if (success) {
      alert('사용자 상태가 변경되었습니다.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      const success = await deleteUser(userId);
      if (success) {
        alert('사용자가 삭제되었습니다.');
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="toss-dashboard">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="toss-loading" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b' }}>사용자 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="toss-dashboard">
      <div className="toss-page-header">
        <div className="toss-page-title-section">
          <h1 className="toss-page-title">사용자 관리</h1>
          <p className="toss-page-subtitle">
            등록된 사용자들을 조회하고 관리할 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/create-tester')}
          className="toss-button"
          style={{ padding: '12px 24px' }}
        >
          + 새 테스터 등록
        </button>
      </div>

      {error && (
        <div className="toss-error" style={{ marginBottom: '24px' }}>
          {error}
          <button 
            onClick={clearError}
            style={{ 
              marginLeft: '10px', 
              background: 'none', 
              border: 'none', 
              color: '#dc2626', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 필터 섹션 */}
      <div className="toss-card-dashboard" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>필터</h3>
        <div className="toss-filter-grid">
          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="toss-form-input"
          >
            <option value="">모든 역할</option>
            <option value="admin">관리자</option>
            <option value="user">일반 사용자</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="toss-form-input"
          >
            <option value="">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="suspended">정지</option>
          </select>

          <input
            type="text"
            placeholder="이메일 검색..."
            value={filters.email}
            onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
            className="toss-form-input"
          />
        </div>
      </div>

      {/* 사용자 테이블 */}
      <div className="toss-table">
        {/* 데스크톱 테이블 */}
        <div className="toss-table-desktop">
          <div className="toss-table-header">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', 
              gap: '16px', 
              alignItems: 'center' 
            }}>
              <div>이메일</div>
              <div>역할</div>
              <div>상태</div>
              <div>가입일</div>
              <div>마지막 로그인</div>
              <div>테스트 수</div>
              <div>관리</div>
            </div>
          </div>
          
          {users.map((user) => (
            <div key={user.id} className="toss-table-row">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', 
                gap: '16px', 
                alignItems: 'center' 
              }}>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{user.email}</div>
                <div>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="toss-form-input"
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                  >
                    <option value="user">일반 사용자</option>
                    <option value="admin">관리자</option>
                  </select>
                </div>
                <div>
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    className="toss-form-input"
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="suspended">정지</option>
                  </select>
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>{user.formattedCreatedAt}</div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>{user.formattedLastLogin}</div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>{user.testCount}</div>
                <div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="toss-button"
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '14px',
                      background: '#dc2626',
                      border: '1px solid #dc2626'
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 모바일 카드들 */}
        <div className="toss-table-mobile">
          {users.map((user) => (
            <div key={user.id} className="toss-mobile-card">
              <div className="toss-mobile-card-header">
                <h4 className="toss-mobile-card-title">{user.email}</h4>
                <span className={`toss-mobile-card-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                  {user.role === 'admin' ? '관리자' : '일반'}
                </span>
              </div>

              <div className="toss-mobile-card-info">
                <div>가입일: {user.formattedCreatedAt}</div>
                <div>테스트 수: {user.testCount}</div>
              </div>

              <div className="toss-mobile-card-form">
                <div className="toss-mobile-card-form-group">
                  <label className="toss-mobile-card-label">역할</label>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="toss-form-input"
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                  >
                    <option value="user">일반 사용자</option>
                    <option value="admin">관리자</option>
                  </select>
                </div>
                <div className="toss-mobile-card-form-group">
                  <label className="toss-mobile-card-label">상태</label>
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    className="toss-form-input"
                    style={{ padding: '8px 12px', fontSize: '14px' }}
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="suspended">정지</option>
                  </select>
                </div>
              </div>

              <div className="toss-mobile-card-actions">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="toss-button"
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '14px',
                    background: '#dc2626',
                    border: '1px solid #dc2626'
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 