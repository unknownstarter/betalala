import { AdminStats } from '../entities/AdminStats.js';
import { UserManagement } from '../entities/UserManagement.js';
import { TestReview } from '../entities/TestReview.js';

export class IAdminRepository {
  // 통계 관련 메서드
  async getAdminStats() {
    throw new Error('getAdminStats method must be implemented');
  }

  // 사용자 관리 관련 메서드
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    throw new Error('getAllUsers method must be implemented');
  }

  async getUserById(userId) {
    throw new Error('getUserById method must be implemented');
  }

  async updateUserRole(userId, newRole) {
    throw new Error('updateUserRole method must be implemented');
  }

  async updateUserStatus(userId, newStatus) {
    throw new Error('updateUserStatus method must be implemented');
  }

  async deleteUser(userId) {
    throw new Error('deleteUser method must be implemented');
  }

  // 테스트 검토 관련 메서드
  async getPendingTests(page = 1, limit = 10) {
    throw new Error('getPendingTests method must be implemented');
  }

  async getTestById(testId) {
    throw new Error('getTestById method must be implemented');
  }

  async approveTest(testId, adminId, comment = '') {
    throw new Error('approveTest method must be implemented');
  }

  async rejectTest(testId, adminId, comment = '') {
    throw new Error('rejectTest method must be implemented');
  }

  async getAllTests(page = 1, limit = 10, filters = {}) {
    throw new Error('getAllTests method must be implemented');
  }
} 