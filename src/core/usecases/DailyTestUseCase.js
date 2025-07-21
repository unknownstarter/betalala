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
      // 파일 업로드
      const mileagePath = `daily-tests/${userId}/${date}/mileage-${Date.now()}-${mileageFile.name}`;
      const creditPath = `daily-tests/${userId}/${date}/credit-${Date.now()}-${creditFile.name}`;

      const [mileageUpload, creditUpload] = await Promise.all([
        this.dailyTestRepository.uploadFile(mileageFile, mileagePath),
        this.dailyTestRepository.uploadFile(creditFile, creditPath)
      ]);

      if (mileageUpload.error) throw mileageUpload.error;
      if (creditUpload.error) throw creditUpload.error;

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