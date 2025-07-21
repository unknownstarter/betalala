import { DailyTest } from '../entities/DailyTest.js';

export class DailyTestRepository {
  async getDailyTestsByUserId(userId) {
    throw new Error('DailyTestRepository.getDailyTestsByUserId must be implemented');
  }

  async getDailyTestByDate(userId, date) {
    throw new Error('DailyTestRepository.getDailyTestByDate must be implemented');
  }

  async createDailyTest(dailyTestData) {
    throw new Error('DailyTestRepository.createDailyTest must be implemented');
  }

  async uploadFile(file, path) {
    throw new Error('DailyTestRepository.uploadFile must be implemented');
  }
} 