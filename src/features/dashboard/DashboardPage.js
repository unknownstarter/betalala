import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth.js';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="toss-dashboard">
      <h1 className="toss-page-title">
        환영합니다, {user?.email}님!
      </h1>
      <p className="toss-page-subtitle">
        테스터 인증 시스템에 오신 것을 환영합니다. 아래 메뉴에서 원하는 작업을 선택하세요.
      </p>
      
      <div className="toss-grid">
        <div className="toss-card-dashboard">
          <h2 className="toss-card-title">코어 테스트</h2>
          <p className="toss-card-content">
            차량 연동부터 크레딧 획득, NFT 민팅까지의 핵심 플로우를 테스트할 수 있습니다.
          </p>
          <Link 
            to="/core-tests"
            className="toss-button"
            style={{ 
              display: 'inline-block', 
              marginTop: '16px',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            시작하기
          </Link>
        </div>
        
        <div className="toss-card-dashboard">
          <h2 className="toss-card-title">데일리 테스트</h2>
          <p className="toss-card-content">
            일일 테스트를 통해 시스템의 안정성과 성능을 확인할 수 있습니다.
          </p>
          <Link 
            to="/daily-tests"
            className="toss-button"
            style={{ 
              display: 'inline-block', 
              marginTop: '16px',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            시작하기
          </Link>
        </div>
        
        <div className="toss-card-dashboard">
          <h2 className="toss-card-title">테스트 결과</h2>
          <p className="toss-card-content">
            이전에 수행한 테스트들의 결과와 통계를 확인할 수 있습니다.
          </p>
          <div 
            className="toss-button"
            style={{ 
              display: 'inline-block', 
              marginTop: '16px',
              textAlign: 'center',
              opacity: 0.7,
              cursor: 'not-allowed'
            }}
          >
            준비 중
          </div>
        </div>
      </div>
    </div>
  );
}; 