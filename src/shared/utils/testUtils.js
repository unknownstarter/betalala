// 테스트를 위한 유틸리티 함수들

/**
 * 테스트용 더미 이미지 파일 생성
 * @param {string} name - 파일명
 * @param {number} size - 파일 크기 (바이트)
 * @returns {File} 더미 파일
 */
export const createDummyImageFile = (name = 'test-image.jpg', size = 1024 * 1024) => {
  const blob = new Blob(['dummy image data'], { type: 'image/jpeg' });
  return new File([blob], name, { type: 'image/jpeg' });
};

/**
 * 파일 업로드 테스트
 * @param {Function} uploadFunction - 업로드 함수
 * @param {File} file - 테스트 파일
 * @returns {Promise<Object>} 테스트 결과
 */
export const testFileUpload = async (uploadFunction, file) => {
  try {
    console.log('🧪 파일 업로드 테스트 시작:', file.name);
    
    const startTime = Date.now();
    const result = await uploadFunction(file);
    const endTime = Date.now();
    
    console.log('📊 테스트 결과:', {
      success: result.success,
      duration: `${endTime - startTime}ms`,
      fileSize: file.size,
      fileName: file.name
    });
    
    return result;
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 여러 파일 동시 업로드 테스트
 * @param {Function} uploadFunction - 업로드 함수
 * @param {Array} files - 테스트 파일 배열
 * @returns {Promise<Array>} 테스트 결과 배열
 */
export const testMultipleFileUpload = async (uploadFunction, files) => {
  console.log('🧪 다중 파일 업로드 테스트 시작:', files.length, '개 파일');
  
  const results = await Promise.all(
    files.map(file => testFileUpload(uploadFunction, file))
  );
  
  const successCount = results.filter(r => r.success).length;
  console.log(`📊 다중 파일 테스트 완료: ${successCount}/${files.length} 성공`);
  
  return results;
};

/**
 * 파일 크기별 테스트
 * @param {Function} uploadFunction - 업로드 함수
 * @returns {Promise<Array>} 테스트 결과
 */
export const testFileSizeLimits = async (uploadFunction) => {
  const testCases = [
    { name: 'small.jpg', size: 100 * 1024 },      // 100KB
    { name: 'medium.jpg', size: 1024 * 1024 },    // 1MB
    { name: 'large.jpg', size: 5 * 1024 * 1024 }, // 5MB
    { name: 'huge.jpg', size: 15 * 1024 * 1024 }  // 15MB (제한 초과)
  ];
  
  const files = testCases.map(testCase => 
    createDummyImageFile(testCase.name, testCase.size)
  );
  
  return await testMultipleFileUpload(uploadFunction, files);
};

/**
 * 파일 타입별 테스트
 * @param {Function} uploadFunction - 업로드 함수
 * @returns {Promise<Array>} 테스트 결과
 */
export const testFileTypes = async (uploadFunction) => {
  const testCases = [
    { name: 'test.jpg', type: 'image/jpeg' },
    { name: 'test.png', type: 'image/png' },
    { name: 'test.webp', type: 'image/webp' },
    { name: 'test.gif', type: 'image/gif' },      // 지원하지 않는 타입
    { name: 'test.pdf', type: 'application/pdf' } // 지원하지 않는 타입
  ];
  
  const files = testCases.map(testCase => {
    const blob = new Blob(['dummy data'], { type: testCase.type });
    return new File([blob], testCase.name, { type: testCase.type });
  });
  
  return await testMultipleFileUpload(uploadFunction, files);
};

/**
 * 성능 테스트
 * @param {Function} uploadFunction - 업로드 함수
 * @param {number} iterations - 반복 횟수
 * @returns {Promise<Object>} 성능 테스트 결과
 */
export const testPerformance = async (uploadFunction, iterations = 5) => {
  console.log(`🧪 성능 테스트 시작: ${iterations}회 반복`);
  
  const times = [];
  const results = [];
  
  for (let i = 0; i < iterations; i++) {
    const file = createDummyImageFile(`perf-test-${i}.jpg`, 512 * 1024);
    
    const startTime = Date.now();
    const result = await uploadFunction(file);
    const endTime = Date.now();
    
    times.push(endTime - startTime);
    results.push(result);
    
    console.log(`📊 반복 ${i + 1}: ${endTime - startTime}ms`);
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const successCount = results.filter(r => r.success).length;
  
  console.log(`📊 성능 테스트 완료:`);
  console.log(`   - 평균 시간: ${avgTime.toFixed(2)}ms`);
  console.log(`   - 성공률: ${successCount}/${iterations}`);
  
  return {
    averageTime: avgTime,
    successRate: successCount / iterations,
    times,
    results
  };
}; 