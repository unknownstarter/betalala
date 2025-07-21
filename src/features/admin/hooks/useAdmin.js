import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth.js';
import { serviceContainer } from '../../../infrastructure/services/ServiceContainer.js';

export const useAdmin = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingTests, setPendingTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const adminUseCase = serviceContainer.getAdminUseCase();

  // 통계 데이터 가져오기
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching admin stats...');
      const result = await adminUseCase.getAdminStats();
      console.log('Admin stats result:', result);
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || '통계 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Error in fetchStats:', err);
      setError('통계 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [adminUseCase]);

  // 사용자 목록 가져오기
  const fetchUsers = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminUseCase.getAllUsers(page, limit, filters);
      if (result.success) {
        setUsers(result.data.users);
        return result.data.total;
      } else {
        setError(result.error);
        return 0;
      }
    } catch (err) {
      setError('사용자 목록을 불러오는데 실패했습니다.');
      return 0;
    } finally {
      setLoading(false);
    }
  }, [adminUseCase]);

  // 대기 중인 테스트 가져오기
  const fetchPendingTests = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminUseCase.getPendingTests(page, limit);
      if (result.success) {
        setPendingTests(result.data.tests);
        return result.data.total;
      } else {
        setError(result.error);
        return 0;
      }
    } catch (err) {
      setError('대기 중인 테스트를 불러오는데 실패했습니다.');
      return 0;
    } finally {
      setLoading(false);
    }
  }, [adminUseCase]);

  // 사용자 역할 변경
  const updateUserRole = useCallback(async (userId, newRole) => {
    try {
      setError(null);
      
      const result = await adminUseCase.updateUserRole(userId, newRole);
      if (result.success) {
        // 사용자 목록 새로고침
        await fetchUsers();
        // 통계도 새로고침
        await fetchStats();
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('사용자 역할 변경에 실패했습니다.');
      return false;
    }
  }, [adminUseCase, fetchUsers, fetchStats]);

  // 사용자 상태 변경
  const updateUserStatus = useCallback(async (userId, newStatus) => {
    try {
      setError(null);
      
      const result = await adminUseCase.updateUserStatus(userId, newStatus);
      if (result.success) {
        // 사용자 목록 새로고침
        await fetchUsers();
        // 통계도 새로고침
        await fetchStats();
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('사용자 상태 변경에 실패했습니다.');
      return false;
    }
  }, [adminUseCase, fetchUsers, fetchStats]);

  // 사용자 삭제
  const deleteUser = useCallback(async (userId) => {
    try {
      setError(null);
      
      const result = await adminUseCase.deleteUser(userId);
      if (result.success) {
        // 사용자 목록 새로고침
        await fetchUsers();
        // 통계도 새로고침
        await fetchStats();
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('사용자 삭제에 실패했습니다.');
      return false;
    }
  }, [adminUseCase, fetchUsers, fetchStats]);

  // 테스터 생성
  const createTester = useCallback(async (testerData) => {
    try {
      setError(null);
      
      const result = await adminUseCase.createTester(testerData);
      if (result.success) {
        // 사용자 목록 새로고침
        await fetchUsers();
        // 통계도 새로고침
        await fetchStats();
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('테스터 생성에 실패했습니다.');
      return false;
    }
  }, [adminUseCase, fetchUsers, fetchStats]);

  // 테스트 승인
  const approveTest = useCallback(async (testId, comment = '') => {
    try {
      setError(null);
      
      const result = await adminUseCase.approveTest(testId, user.id, comment);
      if (result.success) {
        // 대기 중인 테스트 목록 새로고침
        await fetchPendingTests();
        // 통계 새로고침
        await fetchStats();
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('테스트 승인에 실패했습니다.');
      return false;
    }
  }, [adminUseCase, user?.id, fetchPendingTests, fetchStats]);

  // 테스트 거부
  const rejectTest = useCallback(async (testId, comment = '') => {
    try {
      setError(null);
      
      const result = await adminUseCase.rejectTest(testId, user.id, comment);
      if (result.success) {
        // 대기 중인 테스트 목록 새로고침
        await fetchPendingTests();
        // 통계 새로고침
        await fetchStats();
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('테스트 거부에 실패했습니다.');
      return false;
    }
  }, [adminUseCase, user?.id, fetchPendingTests, fetchStats]);

  // 초기 데이터 로드
  useEffect(() => {
    if (user?.isAdmin) {
      fetchStats();
    }
  }, [user, fetchStats]);

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      if (user?.isAdmin) {
        console.log('Page focused, refreshing admin stats...');
        fetchStats();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, fetchStats]);

  return {
    // 상태
    stats,
    users,
    pendingTests,
    loading,
    error,
    
    // 액션
    fetchStats,
    fetchUsers,
    fetchPendingTests,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    createTester,
    approveTest,
    rejectTest,
    
    // 유틸리티
    clearError: () => setError(null)
  };
}; 