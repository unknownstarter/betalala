import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../shared/hooks/useAuth.js';
import { serviceContainer } from '../../infrastructure/services/ServiceContainer.js';
import { FileUpload } from '../../shared/components/FileUpload.js';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const DailyTestPage = () => {
  const { user } = useAuth(); // user만 가져오기
  const [dailyTests, setDailyTests] = useState([]);
  const [todayTest, setTodayTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [mileageFile, setMileageFile] = useState(null);
  const [creditFile, setCreditFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const dailyTestUseCase = serviceContainer.getDailyTestUseCase();
  const today = format(new Date(), 'yyyy-MM-dd');

  const loadDailyTests = useCallback(async () => {
    try {
      console.log('Starting to load daily tests for user:', user.id);
      setLoading(true);
      
      const [testsResult, todayResult] = await Promise.all([
        dailyTestUseCase.getDailyTestsByUserId(user.id),
        dailyTestUseCase.getDailyTestByDate(user.id, today)
      ]);

      console.log('Tests result:', testsResult);
      console.log('Today result:', todayResult);

      if (testsResult.success) {
        setDailyTests(testsResult.dailyTests);
        console.log('Daily tests loaded:', testsResult.dailyTests);
      } else {
        console.error('Failed to load daily tests:', testsResult.error);
      }

      if (todayResult.success) {
        setTodayTest(todayResult.dailyTest);
        console.log('Today test loaded:', todayResult.dailyTest);
      } else {
        console.error('Failed to load today test:', todayResult.error);
      }
    } catch (err) {
      console.error('Error in loadDailyTests:', err);
      setError(err.message);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  }, [user?.id, today, dailyTestUseCase]);

  useEffect(() => {
    if (user) {
      loadDailyTests();
    }
  }, [user, loadDailyTests]);

  const handleSubmit = async () => {
    if (!mileageFile || !creditFile) {
      setError('모든 파일을 업로드해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(0);
      setError(null);
      
      // 업로드 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 200);

      const result = await dailyTestUseCase.submitDailyTest(user.id, today, mileageFile, creditFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setTodayTest(result.dailyTest);
        setDailyTests(prev => [result.dailyTest, ...prev]);
        setMileageFile(null);
        setCreditFile(null);
        
        // 진행률 초기화
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 데이터 로딩 중일 때만
  if (loading) {
    return (
      <div className="toss-dashboard">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="toss-loading" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b' }}>데일리 테스트 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="toss-dashboard" style={{ paddingTop: '20px' }}>
      {/* 페이지 헤더 */}
      <div className="toss-page-header" style={{ marginBottom: '32px', gap: '8px' }}>
        <div className="toss-page-title-section">
          <h1 className="toss-page-title">데일리 테스트 인증</h1>
          <p className="toss-page-subtitle">
            매일 주행거리 업데이트와 크레딧 수집을 인증하세요.
          </p>
        </div>
      </div>

      {error && (
        <div className="toss-error" style={{ marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* 오늘 인증 섹션 */}
      <div className="toss-card-dashboard" style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          marginBottom: '16px', 
          color: '#1e293b', 
          fontSize: '18px', 
          fontWeight: '600' 
        }}>
          오늘 인증 ({format(new Date(today), 'yyyy년 MM월 dd일', { locale: ko })})
        </h2>

        {todayTest ? (
          <div style={{ 
            background: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '12px', 
            padding: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              background: '#6c757d', 
              borderRadius: '50%',
              marginRight: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
            </div>
            <span style={{ color: '#495057', fontWeight: '500' }}>오늘 인증이 완료되었습니다!</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px' 
            }}>
              <FileUpload
                onFileSelect={setMileageFile}
                accept="image/*"
                label="EV 주행거리 업데이트 스크린샷"
                disabled={submitting}
                selectedFile={mileageFile}
              />
              <FileUpload
                onFileSelect={setCreditFile}
                accept="image/*"
                label="크레딧 수집 스크린샷"
                disabled={submitting}
                selectedFile={creditFile}
              />
            </div>

            {/* 제출 버튼 섹션 */}
            <div style={{ 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '20px',
              textAlign: 'center'
            }}>
              {!mileageFile || !creditFile ? (
                <>
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '14px', 
                    marginBottom: '16px',
                    lineHeight: '1.5'
                  }}>
                    사진을 모두 등록하면 제출할 수 있습니다.
                  </p>
                  <button
                    disabled={true}
                    className="toss-button"
                    style={{ 
                      padding: '12px 24px', 
                      fontSize: '16px',
                      opacity: 0.5,
                      cursor: 'not-allowed'
                    }}
                  >
                    제출하기
                  </button>
                </>
              ) : (
                <>
                  <div style={{ 
                    background: '#eff6ff', 
                    border: '1px solid #bfdbfe', 
                    borderRadius: '8px', 
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          background: '#3b82f6', 
                          borderRadius: '2px',
                          marginRight: '8px'
                        }}></div>
                        <span style={{ fontSize: '14px', color: '#1e40af' }}>{mileageFile.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          background: '#3b82f6', 
                          borderRadius: '2px',
                          marginRight: '8px'
                        }}></div>
                        <span style={{ fontSize: '14px', color: '#1e40af' }}>{creditFile.name}</span>
                      </div>
                    </div>
                  </div>
                  {uploadProgress > 0 ? (
                    <div style={{ width: '100%' }}>
                      <div style={{
                        background: '#e5e7eb',
                        borderRadius: '8px',
                        height: '8px',
                        marginBottom: '12px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: '#10b981',
                          height: '100%',
                          width: `${uploadProgress}%`,
                          transition: 'width 0.3s ease',
                          borderRadius: '8px'
                        }} />
                      </div>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        margin: '0 0 12px 0',
                        textAlign: 'center'
                      }}>
                        업로드 중... {uploadProgress}%
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="toss-button"
                      style={{ padding: '12px 24px', fontSize: '16px' }}
                    >
                      {submitting ? '제출 중...' : '제출하기'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 인증 이력 */}
      <div className="toss-card-dashboard">
        <h2 style={{ 
          marginBottom: '16px', 
          color: '#1e293b', 
          fontSize: '18px', 
          fontWeight: '600' 
        }}>
          인증 이력
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dailyTests.length === 0 ? (
            <p style={{ 
              color: '#64748b', 
              textAlign: 'center', 
              padding: '32px',
              fontSize: '14px'
            }}>
              아직 인증 이력이 없습니다.
            </p>
          ) : (
            dailyTests.map((test) => (
              <div key={test.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '16px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                background: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    background: '#22c55e', 
                    borderRadius: '50%',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                  </div>
                  <div>
                    <p style={{ 
                      fontWeight: '500', 
                      color: '#1e293b',
                      margin: 0
                    }}>
                      {format(new Date(test.date), 'yyyy년 MM월 dd일', { locale: ko })}
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#64748b',
                      margin: 0
                    }}>
                      {format(new Date(test.completedAt), 'HH:mm', { locale: ko })} 제출
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 