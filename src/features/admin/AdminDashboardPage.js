import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './hooks/useAdmin.js';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { stats, loading, error } = useAdmin();

  console.log('AdminDashboardPage render:', { stats, loading, error });

  if (loading && !stats) {
    return (
      <div className="toss-dashboard">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="toss-loading" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b' }}>관리자 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="toss-dashboard">
        <div className="toss-error" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3>데이터 로딩 오류</h3>
          <p>{error}</p>
          <button 
            className="toss-button" 
            onClick={() => window.location.reload()}
            style={{ marginTop: '16px' }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="toss-dashboard">
      <h1 className="toss-page-title">
        관리자 대시보드
      </h1>
      <p className="toss-page-subtitle">
        시스템 전체 현황을 모니터링하고 관리할 수 있습니다.
      </p>

      {/* 통계 카드들 */}
      <div className="toss-grid" style={{ marginBottom: '40px' }}>
        <div className="toss-card-dashboard">
          <h2 className="toss-card-title">전체 사용자</h2>
          <div className="toss-card-stats">
            {stats?.totalUsers || 0}
          </div>
          <p className="toss-card-content">
            등록된 총 사용자 수
          </p>
          <div style={{ 
            fontSize: '14px', 
            color: '#94a3b8',
            marginTop: '8px'
          }}>
            관리자: {stats?.adminUsers || 0} | 일반: {stats?.regularUsers || 0}
          </div>
        </div>

        <div className="toss-card-dashboard">
          <h2 className="toss-card-title">전체 테스트</h2>
          <div className="toss-card-stats">
            {stats?.totalTests || 0}
          </div>
          <p className="toss-card-content">
            완료된 총 테스트 수
          </p>
          <div style={{ 
            fontSize: '14px', 
            color: '#94a3b8',
            marginTop: '8px'
          }}>
            코어: {stats?.totalCoreTests || 0} | 데일리: {stats?.totalDailyTests || 0}
          </div>
        </div>

        <div className="toss-card-dashboard">
          <h2 className="toss-card-title">대기 중인 테스트</h2>
          <div className="toss-card-stats">
            {stats?.pendingTests || 0}
          </div>
          <p className="toss-card-content">
            검토 대기 중인 테스트
          </p>
          <div style={{ 
            fontSize: '14px', 
            color: '#94a3b8',
            marginTop: '8px'
          }}>
            대기율: {stats?.pendingRate || 0}%
          </div>
        </div>
      </div>

      {/* 관리 기능 카드들 */}
      <div className="toss-grid">
        <div className="toss-card-dashboard">
          <h2 className="toss-card-title">사용자 관리</h2>
          <p className="toss-card-content">
            등록된 사용자들을 조회하고 관리할 수 있습니다.
          </p>
          <button 
            className="toss-button"
            style={{ 
              display: 'inline-block', 
              marginTop: '16px',
              textDecoration: 'none',
              textAlign: 'center'
            }}
            onClick={() => navigate('/admin/users')}
          >
            사용자 목록 보기
          </button>
        </div>

        <div className="toss-card-dashboard">
          <h2 className="toss-card-title">테스트 결과 관리</h2>
          <p className="toss-card-content">
            제출된 테스트 결과들을 검토하고 승인/거부할 수 있습니다.
          </p>
          <button 
            className="toss-button"
            style={{ 
              display: 'inline-block', 
              marginTop: '16px',
              textDecoration: 'none',
              textAlign: 'center'
            }}
            onClick={() => navigate('/admin/tests')}
          >
            테스트 결과 보기
          </button>
        </div>
      </div>
    </div>
  );
}; 