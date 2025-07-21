export class AdminUseCase {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  // 통계 관련 유스케이스
  async getAdminStats() {
    try {
      const stats = await this.adminRepository.getAdminStats();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting admin stats:', error);
      return { success: false, error: error.message };
    }
  }

  // 사용자 관리 관련 유스케이스
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    try {
      const users = await this.adminRepository.getAllUsers(page, limit, filters);
      return { success: true, data: users };
    } catch (error) {
      console.error('Error getting all users:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      if (!['admin', 'user'].includes(newRole)) {
        return { success: false, error: '유효하지 않은 역할입니다.' };
      }

      const result = await this.adminRepository.updateUserRole(userId, newRole);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserStatus(userId, newStatus) {
    try {
      if (!['active', 'inactive', 'suspended'].includes(newStatus)) {
        return { success: false, error: '유효하지 않은 상태입니다.' };
      }

      const result = await this.adminRepository.updateUserStatus(userId, newStatus);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error updating user status:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteUser(userId) {
    try {
      const result = await this.adminRepository.deleteUser(userId);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  }

  async createTester(testerData) {
    try {
      if (!testerData.email || !testerData.email.trim()) {
        return { success: false, error: '이메일은 필수입니다.' };
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(testerData.email)) {
        return { success: false, error: '유효한 이메일 형식이 아닙니다.' };
      }

      const result = await this.adminRepository.createTester(testerData);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating tester:', error);
      return { success: false, error: error.message };
    }
  }

  // 테스트 검토 관련 유스케이스
  async getPendingTests(page = 1, limit = 10) {
    try {
      const tests = await this.adminRepository.getPendingTests(page, limit);
      return { success: true, data: tests };
    } catch (error) {
      console.error('Error getting pending tests:', error);
      return { success: false, error: error.message };
    }
  }

  async approveTest(testId, adminId, comment = '') {
    try {
      if (!testId || !adminId) {
        return { success: false, error: '필수 정보가 누락되었습니다.' };
      }

      const result = await this.adminRepository.approveTest(testId, adminId, comment);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error approving test:', error);
      return { success: false, error: error.message };
    }
  }

  async rejectTest(testId, adminId, comment = '') {
    try {
      if (!testId || !adminId) {
        return { success: false, error: '필수 정보가 누락되었습니다.' };
      }

      if (!comment.trim()) {
        return { success: false, error: '거부 사유를 입력해주세요.' };
      }

      const result = await this.adminRepository.rejectTest(testId, adminId, comment);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error rejecting test:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllTests(page = 1, limit = 10, filters = {}) {
    try {
      const tests = await this.adminRepository.getAllTests(page, limit, filters);
      return { success: true, data: tests };
    } catch (error) {
      console.error('Error getting all tests:', error);
      return { success: false, error: error.message };
    }
  }
} 