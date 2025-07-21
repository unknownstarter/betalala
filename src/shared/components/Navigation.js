import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('=== Navigation Debug ===');
  console.log('user:', user);
  console.log('user.role:', user?.role);

  const handleSignOut = async () => {
    console.log('Logout button clicked');
    try {
      const result = await signOut();
      console.log('SignOut result:', result);
      if (result.success) {
        console.log('Logout successful, navigating to login');
        navigate('/login');
      } else {
        console.error('Logout failed:', result.error);
        alert('로그아웃에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('로그아웃 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // role이 'admin'인지 확인
  const isAdmin = user?.role === 'admin';
  console.log('isAdmin:', isAdmin);

  // 모바일 전용 인라인 스타일 정의
  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  };

  const navContentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 8px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const brandStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
    textDecoration: 'none',
  };

  const buttonsStyle = {
    display: 'flex',
    gap: '3px',
    alignItems: 'center',
  };

  const linkStyle = (active) => ({
    padding: '3px 6px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: '500',
    color: active ? 'white' : '#64748b',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    background: active ? '#f97316' : 'transparent',
    borderColor: active ? '#f97316' : 'transparent',
  });

  const logoutButtonStyle = {
    padding: '3px 6px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: '500',
    border: '1px solid #dc2626',
    background: '#dc2626',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <nav style={navStyle}>
      <div style={navContentStyle}>
        <Link to="/dashboard" style={brandStyle}>
          Tesla Tester Auth
        </Link>
        
        <div style={buttonsStyle}>
          {/* 관리자만 관리자 메뉴 보이기 */}
          {isAdmin && (
            <Link 
              to="/admin" 
              style={linkStyle(isActive('/admin') || isActive('/admin/users') || isActive('/admin/tests') || isActive('/admin/create-tester'))}
            >
              관리자
            </Link>
          )}
          
          {/* 일반 사용자만 코어 테스트와 데일리 테스트 접근 가능 */}
          {!isAdmin && (
            <>
              <Link 
                to="/core-tests" 
                style={linkStyle(isActive('/core-tests'))}
              >
                코어 테스트
              </Link>
              
              <Link 
                to="/daily-tests" 
                style={linkStyle(isActive('/daily-tests'))}
              >
                데일리 테스트
              </Link>
            </>
          )}
          
          <button 
            onClick={handleSignOut}
            style={logoutButtonStyle}
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}; 