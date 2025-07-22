import { CoreTest, CORE_TEST_STEPS } from '../entities/CoreTest.js';

export class CoreTestUseCase {
  constructor(coreTestRepository) {
    this.coreTestRepository = coreTestRepository;
  }

  async getCoreTestsByUserId(userId) {
    try {
      const { data, error } = await this.coreTestRepository.getCoreTestsByUserId(userId);
      if (error) throw error;
      
      const coreTests = data.map(test => CoreTest.fromJson(test));
      return { success: true, coreTests };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async submitCoreTest(userId, step, file) {
    try {
      // 파일 업로드 (개선된 서비스 사용)
      const filePath = `core-tests/${userId}/${step}`;
      const uploadResult = await this.coreTestRepository.uploadFileWithService(file, filePath);
      
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }

      // 코어 테스트 생성
      const coreTestData = {
        user_id: userId,
        step,
        file_url: uploadResult.data.path
      };

      const { data, error } = await this.coreTestRepository.createCoreTest(coreTestData);
      if (error) throw error;

      const coreTest = CoreTest.fromJson(data[0]);
      return { success: true, coreTest };
    } catch (error) {
      console.error('Core test submission error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCompletedSteps(userId) {
    try {
      const { data, error } = await this.coreTestRepository.getCoreTestsByUserId(userId);
      if (error) throw error;
      
      const completedSteps = data.map(test => test.step);
      return { success: true, completedSteps };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getAllSteps() {
    return Object.values(CORE_TEST_STEPS);
  }
} 