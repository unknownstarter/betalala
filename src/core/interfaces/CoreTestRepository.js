import { CoreTest } from '../entities/CoreTest.js';

export class CoreTestRepository {
  async getCoreTestsByUserId(userId) {
    throw new Error('CoreTestRepository.getCoreTestsByUserId must be implemented');
  }

  async createCoreTest(coreTestData) {
    throw new Error('CoreTestRepository.createCoreTest must be implemented');
  }

  async uploadFile(file, path) {
    throw new Error('CoreTestRepository.uploadFile must be implemented');
  }
} 