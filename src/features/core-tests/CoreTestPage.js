import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../shared/hooks/useAuth.js';
import { serviceContainer } from '../../infrastructure/services/ServiceContainer.js';
import { CORE_TEST_STEPS, CORE_TEST_STEP_LABELS } from '../../core/entities/CoreTest.js';
import { FileUpload } from '../../shared/components/FileUpload.js';

export const CoreTestPage = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [stepLoading, setStepLoading] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  const coreTestUseCase = serviceContainer.getCoreTestUseCase();

  // 완료된 단계들을 가져오기
  useEffect(() => {
    const fetchCompletedSteps = async () => {
      try {
        const result = await coreTestUseCase.getCompletedSteps(user.id);
        if (result.success) {
          setCompletedSteps(result.completedSteps);
        }
      } catch (err) {
        console.error('Error fetching completed steps:', err);
      }
    };

    if (user) {
      fetchCompletedSteps();
    }
  }, [user, coreTestUseCase]);

  const handleFileUpload = useCallback((step, file) => {
    setUploads(prev => ({
      ...prev,
      [step]: file
    }));
  }, []);

  const handleStepSubmit = async (step) => {
    if (!uploads[step]) {
      setError('파일을 선택해주세요.');
      return;
    }

    setStepLoading(prev => ({ ...prev, [step]: true }));
    setUploadProgress(prev => ({ ...prev, [step]: 0 }));
    setError(null);

    try {
      // 업로드 진행률 시뮬레이션 (실제로는 서비스에서 처리)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[step] || 0;
          if (current < 90) {
            return { ...prev, [step]: current + 10 };
          }
          return prev;
        });
      }, 200);

      console.log('📤 코어 테스트 제출 시작:', {
        step: step,
        fileName: uploads[step].name,
        fileSize: uploads[step].size
      });

      const result = await coreTestUseCase.submitCoreTest(user.id, step, uploads[step]);
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [step]: 100 }));

      console.log('📤 코어 테스트 제출 결과:', result);

      if (result.success) {
        console.log('✅ 코어 테스트 제출 성공');
        setCompletedSteps(prev => [...prev, step]);
        setUploads(prev => {
          const newUploads = { ...prev };
          delete newUploads[step];
          return newUploads;
        });
        setSuccess(`${CORE_TEST_STEP_LABELS[step]} 완료!`);
        
        // 진행률 초기화
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[step];
            return newProgress;
          });
        }, 1000);
      } else {
        console.error('❌ 코어 테스트 제출 실패:', result.error);
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setStepLoading(prev => ({ ...prev, [step]: false }));
    }
  };

  const isStepCompleted = (step) => {
    return completedSteps.includes(step);
  };

  const steps = [
    {
      step: CORE_TEST_STEPS.SIGNUP,
      title: '리사이클팜 앱 회원가입 및 전화번호 인증',
      description: '리사이클팜 앱에서 회원가입을 완료하고 전화번호 인증을 진행한 스크린샷을 업로드하세요.'
    },
    {
      step: CORE_TEST_STEPS.EV_CONNECT,
      title: '테슬라 차량 연동 화면 인증',
      description: '테슬라 차량을 성공적으로 연동한 화면의 스크린샷을 업로드하세요.'
    },
    {
      step: CORE_TEST_STEPS.UPDATE,
      title: 'EV 주행거리 업데이트 성공 화면',
      description: 'EV 주행거리를 성공적으로 업데이트한 화면의 스크린샷을 업로드하세요.'
    },
    {
      step: CORE_TEST_STEPS.CREDIT,
      title: '크레딧 획득 화면 인증',
      description: '차량 연동 후 크레딧을 성공적으로 획득한 화면의 스크린샷을 업로드하세요.'
    },
    {
      step: CORE_TEST_STEPS.NFT,
      title: 'NFT 민팅 완료 화면 인증',
      description: '크레딧으로 NFT를 성공적으로 민팅한 화면의 스크린샷을 업로드하세요.'
    }
  ];

  return (
    <div className="modern-dashboard" style={{ paddingTop: '20px' }}>
      <h1 className="dashboard-title" style={{ marginBottom: '8px' }}>
        코어 테스트 인증
      </h1>
      <p className="dashboard-subtitle" style={{ marginBottom: '32px' }}>
        아래 단계들을 순서대로 완료하여 인증을 진행하세요.
      </p>

      {error && (
        <div className="modern-error" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          maxWidth: '600px',
          margin: '0 auto 24px',
          fontSize: '14px'
        }}>
          {success}
        </div>
      )}

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {steps.map((stepInfo, index) => (
          <div key={stepInfo.step} className="modern-card-dashboard" style={{ 
            marginBottom: '24px',
            background: isStepCompleted(stepInfo.step) ? '#f8f9fa' : 'white',
            border: isStepCompleted(stepInfo.step) ? '1px solid #e9ecef' : '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="modern-card-title" style={{
                color: isStepCompleted(stepInfo.step) ? '#6c757d' : '#1a202c'
              }}>
                {index + 1}. {stepInfo.title}
              </h2>
            </div>
            <p className="modern-card-content" style={{ 
              marginBottom: '20px',
              color: isStepCompleted(stepInfo.step) ? '#6c757d' : '#4a5568'
            }}>
              {stepInfo.description}
            </p>
            
            {isStepCompleted(stepInfo.step) ? (
              <div style={{
                background: '#e9ecef',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#495057', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                  ✅ 미션 완료!
                </p>
                <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '16px' }}>
                  스크린샷을 다시 등록하려면 아래 버튼을 클릭하세요.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCompletedSteps(prev => prev.filter(s => s !== stepInfo.step));
                    setUploads(prev => ({ ...prev, [stepInfo.step]: null }));
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
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
                  수정하기
                </button>
              </div>
            ) : (
              <>
                <FileUpload
                  onFileSelect={(file) => handleFileUpload(stepInfo.step, file)}
                  accept="image/*"
                  label="스크린샷 업로드"
                  disabled={stepLoading[stepInfo.step]}
                  selectedFile={uploads[stepInfo.step]}
                />
                
                {/* 제출 버튼 섹션 */}
                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  padding: '20px',
                  textAlign: 'center',
                  marginTop: '20px'
                }}>
                  {!uploads[stepInfo.step] ? (
                    <>
                      <p style={{ 
                        color: '#64748b', 
                        fontSize: '14px', 
                        marginBottom: '16px',
                        lineHeight: '1.5'
                      }}>
                        스크린샷을 등록하면 제출할 수 있습니다.
                      </p>
                      <button
                        disabled={true}
                        style={{
                          background: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '500',
                          cursor: 'not-allowed',
                          opacity: 0.5
                        }}
                      >
                        미션 완료
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ 
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span style={{ color: '#10b981', fontSize: '16px' }}>📷</span>
                          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>
                            {uploads[stepInfo.step].name}
                          </span>
                          <span style={{ color: '#10b981', fontSize: '12px' }}>
                            ({(uploads[stepInfo.step].size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </div>
                      {uploadProgress[stepInfo.step] !== undefined ? (
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
                              width: `${uploadProgress[stepInfo.step]}%`,
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
                            업로드 중... {uploadProgress[stepInfo.step]}%
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStepSubmit(stepInfo.step)}
                          disabled={stepLoading[stepInfo.step]}
                          style={{
                            background: stepLoading[stepInfo.step] ? 'rgba(255, 255, 255, 0.3)' : '#f97316',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: stepLoading[stepInfo.step] ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {stepLoading[stepInfo.step] ? (
                            <>
                              <span className="modern-loading" style={{ marginRight: '8px' }}></span>
                              제출 중...
                            </>
                          ) : (
                            '미션 완료'
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}; 