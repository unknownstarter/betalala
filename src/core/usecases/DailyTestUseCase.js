import { DailyTest } from '../entities/DailyTest.js';

export class DailyTestUseCase {
  constructor(dailyTestRepository) {
    this.dailyTestRepository = dailyTestRepository;
  }

  async getDailyTestsByUserId(userId) {
    try {
      const { data, error } = await this.dailyTestRepository.getDailyTestsByUserId(userId);
      if (error) throw error;
      
      const dailyTests = data.map(test => DailyTest.fromJson(test));
      return { success: true, dailyTests };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async submitDailyTest(userId, date, mileageFile, creditFile) {
    try {
      // 파일 업로드 (개선된 서비스 사용)
      const basePath = `daily-tests/${userId}/${date}`;
      const mileagePath = `${basePath}/mileage`;
      const creditPath = `${basePath}/credit`;

      const [mileageUpload, creditUpload] = await Promise.all([
        this.dailyTestRepository.uploadFileWithService(mileageFile, mileagePath),
        this.dailyTestRepository.uploadFileWithService(creditFile, creditPath)
      ]);

      if (!mileageUpload.success) {
        return { success: false, error: `주행거리 이미지 업로드 실패: ${mileageUpload.error}` };
      }

      if (!creditUpload.success) {
        return { success: false, error: `크레딧 이미지 업로드 실패: ${creditUpload.error}` };
      }

      // 데일리 테스트 생성
      const dailyTestData = {
        user_id: userId,
        date,
        mileage_update_image_url: mileageUpload.data.path,
        credit_earned_image_url: creditUpload.data.path
      };

      const { data, error } = await this.dailyTestRepository.createDailyTest(dailyTestData);
      if (error) throw error;

      const dailyTest = DailyTest.fromJson(data[0]);
      return { success: true, dailyTest };
    } catch (error) {
      console.error('Daily test submission error:', error);
      return { success: false, error: error.message };
    }
  }

  async getDailyTestByDate(userId, date) {
    try {
      const { data, error } = await this.dailyTestRepository.getDailyTestByDate(userId, date);
      if (error) throw error;
      
      if (data && data.length > 0) {
        const dailyTest = DailyTest.fromJson(data[0]);
        return { success: true, dailyTest };
      }
      return { success: true, dailyTest: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
} 