import React, { useState, useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin.js';

export const TestReviewPage = () => {
  const { 
    pendingTests, 
    loading, 
    error, 
    fetchPendingTests, 
    approveTest, 
    rejectTest,
    clearError 
  } = useAdmin();

  const [currentPage] = useState(1);
  const [selectedTest, setSelectedTest] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchPendingTests(currentPage, 10);
  }, [currentPage, fetchPendingTests]);

  const handleApprove = async (testId) => {
    const success = await approveTest(testId, comment);
    if (success) {
      setComment('');
      setSelectedTest(null);
      alert('테스트가 승인되었습니다.');
    }
  };

  const handleReject = async (testId) => {
    if (!comment.trim()) {
      alert('거부 사유를 입력해주세요.');
      return;
    }
    
    const success = await rejectTest(testId, comment);
    if (success) {
      setComment('');
      setSelectedTest(null);
      alert('테스트가 거부되었습니다.');
    }
  };

  if (loading && pendingTests.length === 0) {
    return (
      <div className="modern-dashboard">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="modern-loading" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b' }}>테스트 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      <h1 className="dashboard-title">테스트 결과 관리</h1>
      <p className="dashboard-subtitle">
        제출된 테스트 결과들을 검토하고 승인/거부할 수 있습니다.
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

      {/* 테스트 목록 */}
      <div className="modern-card-dashboard">
        <h3 style={{ marginBottom: '16px', color: 'white' }}>
          대기 중인 테스트 ({pendingTests.length}개)
        </h3>
        
        {pendingTests.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>
            대기 중인 테스트가 없습니다.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingTests.map((test) => (
              <div 
                key={test.id} 
                className="modern-card-dashboard"
                style={{ 
                  padding: '16px',
                  border: selectedTest?.id === test.id ? '2px solid #3b82f6' : '1px solid #374151'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: 'white', marginBottom: '8px' }}>
                      {test.testTypeText} - {test.userEmail}
                    </h4>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                      제출일: {test.formattedSubmittedAt}
                    </p>
                    {test.files && test.files.length > 0 && (
                      <div style={{ marginBottom: '8px' }}>
                        <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>
                          첨부 파일:
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {test.files.map((file, index) => (
                            <span 
                              key={index}
                              style={{
                                padding: '2px 6px',
                                background: '#374151',
                                borderRadius: '4px',
                                fontSize: '12px',
                                color: '#d1d5db'
                              }}
                            >
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedTest(test)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #3b82f6',
                        background: '#3b82f6',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      검토하기
                    </button>
                  </div>
                </div>

                {/* 검토 패널 */}
                {selectedTest?.id === test.id && (
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '16px', 
                    background: '#1f2937', 
                    borderRadius: '8px',
                    border: '1px solid #374151'
                  }}>
                    <h5 style={{ color: 'white', marginBottom: '12px' }}>검토 의견</h5>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="검토 의견을 입력하세요 (거부 시 필수)"
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #374151',
                        background: '#111827',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical',
                        marginBottom: '12px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setSelectedTest(null);
                          setComment('');
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #6b7280',
                          background: '#6b7280',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleReject(test.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #dc2626',
                          background: '#dc2626',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        거부
                      </button>
                      <button
                        onClick={() => handleApprove(test.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #059669',
                          background: '#059669',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        승인
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 