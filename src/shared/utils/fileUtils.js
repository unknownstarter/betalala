// 파일 업로드 관련 유틸리티 함수들

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

export const FILE_SIZE_LIMITS = {
  MAX_SIZE_MB: 10, // 10MB
  MAX_SIZE_BYTES: 10 * 1024 * 1024
};

/**
 * 파일 유효성 검증
 * @param {File} file - 검증할 파일
 * @returns {Object} 검증 결과 { isValid: boolean, error?: string }
 */
export const validateFile = (file) => {
  if (!file) {
    return { isValid: false, error: '파일을 선택해주세요.' };
  }

  // 파일 크기 검증
  if (file.size > FILE_SIZE_LIMITS.MAX_SIZE_BYTES) {
    return { 
      isValid: false, 
      error: `파일 크기는 ${FILE_SIZE_LIMITS.MAX_SIZE_MB}MB 이하여야 합니다.` 
    };
  }

  // 파일 타입 검증
  if (!FILE_TYPES.ALLOWED.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'JPG, PNG, WebP 형식의 이미지 파일만 업로드 가능합니다.' 
    };
  }

  return { isValid: true };
};

/**
 * 파일 크기를 읽기 쉬운 형태로 변환
 * @param {number} bytes - 바이트 단위 크기
 * @returns {string} 변환된 크기 문자열
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 파일명에서 확장자 추출
 * @param {string} filename - 파일명
 * @returns {string} 확장자
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * 안전한 파일명 생성
 * @param {string} originalName - 원본 파일명
 * @param {string} prefix - 접두사
 * @returns {string} 안전한 파일명
 */
export const generateSafeFileName = (originalName, prefix = '') => {
  const timestamp = Date.now();
  
  // 한글, 띄어쓰기, 특수문자를 모두 제거하고 영문/숫자만 남김
  const safeName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')  // 특수문자를 언더스코어로 변경
    .replace(/_+/g, '_')              // 연속된 언더스코어를 하나로
    .replace(/^_|_$/g, '')            // 앞뒤 언더스코어 제거
    .toLowerCase();                   // 소문자로 변환
  
  // 파일명이 비어있으면 기본값 사용
  const finalName = safeName || 'image';
  
  return `${prefix}${timestamp}_${finalName}`;
};

/**
 * 이미지 파일 압축 (클라이언트 사이드)
 * @param {File} file - 압축할 이미지 파일
 * @param {number} maxWidth - 최대 너비
 * @param {number} quality - 품질 (0-1)
 * @returns {Promise<File>} 압축된 파일
 */
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 비율 유지하면서 크기 조정
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // 이미지 그리기
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // 압축된 파일 생성
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('이미지 로드에 실패했습니다.'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 파일 업로드 진행률 계산
 * @param {number} loaded - 로드된 바이트
 * @param {number} total - 전체 바이트
 * @returns {number} 진행률 (0-100)
 */
export const calculateProgress = (loaded, total) => {
  return Math.round((loaded / total) * 100);
}; 