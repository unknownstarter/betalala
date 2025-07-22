import { supabase } from '../supabase/client.js';

export class EdgeFunctionService {
  constructor() {
    this.baseUrl = 'https://lwdqeumtozjiqzygcmsi.supabase.co/functions/v1';
  }

  /**
   * Edge Function 호출
   * @param {string} functionName - 함수 이름
   * @param {Object} data - 전송할 데이터
   * @returns {Promise<Object>} 응답 결과
   */
  async callFunction(functionName, data) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { success: false, error: '인증이 필요합니다.' };
      }

      const response = await fetch(`${this.baseUrl}/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || '함수 호출에 실패했습니다.' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Edge function call error:', error);
      return { success: false, error: '서버 연결에 실패했습니다.' };
    }
  }

  /**
   * 파일 업로드 처리 함수 호출
   * @param {Object} uploadData - 업로드 데이터
   * @returns {Promise<Object>} 처리 결과
   */
  async processUpload(uploadData) {
    return await this.callFunction('process-upload', uploadData);
  }

  /**
   * 코어 테스트 업로드 처리
   * @param {string} userId - 사용자 ID
   * @param {string} step - 테스트 단계
   * @param {string} filePath - 파일 경로
   * @param {string} fileType - 파일 타입
   * @param {number} fileSize - 파일 크기
   * @returns {Promise<Object>} 처리 결과
   */
  async processCoreTestUpload(userId, step, filePath, fileType, fileSize) {
    return await this.processUpload({
      userId,
      testType: 'core',
      step,
      filePath,
      fileType,
      fileSize
    });
  }

  /**
   * 데일리 테스트 업로드 처리
   * @param {string} userId - 사용자 ID
   * @param {string} date - 날짜
   * @param {string} filePath - 파일 경로
   * @param {string} fileType - 파일 타입
   * @param {number} fileSize - 파일 크기
   * @returns {Promise<Object>} 처리 결과
   */
  async processDailyTestUpload(userId, date, filePath, fileType, fileSize) {
    return await this.processUpload({
      userId,
      testType: 'daily',
      date,
      filePath,
      fileType,
      fileSize
    });
  }
}

// 싱글톤 인스턴스
export const edgeFunctionService = new EdgeFunctionService(); 