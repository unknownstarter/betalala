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
      // 파일 업로드
      const filePath = `core-tests/${userId}/${step}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await this.coreTestRepository.uploadFile(file, filePath);
      if (uploadError) throw uploadError;

      // 코어 테스트 생성
      const coreTestData = {
        user_id: userId,
        step,
        file_url: uploadData.path
      };

      const { data, error } = await this.coreTestRepository.createCoreTest(coreTestData);
      if (error) throw error;

      const coreTest = CoreTest.fromJson(data[0]);
      return { success: true, coreTest };
    } catch (error) {
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