import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth.js';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="toss-container">
      <div className="toss-card">
        <h1 className="toss-title">테스터 인증 시스템</h1>
        <p className="toss-subtitle">계정에 로그인하세요</p>
        
        {error && (
          <div className="toss-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="toss-input-group">
            <input
              type="email"
              className="toss-input"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="toss-input-group">
            <input
              type="password"
              className="toss-input"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="toss-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="toss-loading"></span>
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}; 