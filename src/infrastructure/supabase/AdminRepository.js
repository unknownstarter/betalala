import { supabase, supabaseAdmin } from './SupabaseClient.js';
import { AdminStats } from '../../core/entities/AdminStats.js';
import { UserManagement } from '../../core/entities/UserManagement.js';
import { TestReview } from '../../core/entities/TestReview.js';

export class SupabaseAdminRepository {
  // 통계 관련 메서드
  async getAdminStats() {
    try {
      console.log('=== Admin Stats Debug Start ===');
      console.log('Fetching real admin stats from Supabase');
      console.log('Using supabaseAdmin client:', !!supabaseAdmin);
      
      // 실제 Supabase 쿼리들 (관리자 클라이언트 사용)
      console.log('Querying user_profiles table with supabaseAdmin...');
      const { data: users, error: usersError } = await supabaseAdmin
        .from('user_profiles')
        .select('*');

      console.log('=== USER_PROFILES QUERY RESULT (supabaseAdmin) ===');
      console.log('Raw query result:', { data: users, error: usersError });
      console.log('usersError:', usersError);
      console.log('usersError code:', usersError?.code);
      console.log('usersError message:', usersError?.message);
      console.log('users data type:', typeof users);
      console.log('users is array:', Array.isArray(users));
      console.log('users length:', users?.length || 0);
      console.log('users data:', users);
      
      // 일반 클라이언트로도 테스트해보기
      console.log('=== TESTING WITH REGULAR CLIENT ===');
      const { data: usersRegular, error: usersErrorRegular } = await supabase
        .from('user_profiles')
        .select('*');
      
      console.log('Regular client result:', { data: usersRegular, error: usersErrorRegular });
      console.log('Regular client users length:', usersRegular?.length || 0);
      
      if (users && users.length > 0) {
        console.log('=== DETAILED USER DATA ===');
        users.forEach((user, index) => {
          console.log(`User ${index + 1}:`, {
            id: user.id,
            user_id: user.user_id,
            email: user.email,
            role: user.role,
            status: user.status,
            created_at: user.created_at,
            updated_at: user.updated_at
          });
        });
        console.log('All user roles:', users.map(u => u.role));
        console.log('All user emails:', users.map(u => u.email));
      } else {
        console.log('No users found in user_profiles table');
      }

      console.log('Querying core_tests table...');
      const { data: coreTests, error: coreTestsError } = await supabaseAdmin
        .from('core_tests')
        .select('*');

      console.log('core_tests query result:', { coreTests, coreTestsError });

      console.log('Querying daily_tests table...');
      const { data: dailyTests, error: dailyTestsError } = await supabaseAdmin
        .from('daily_tests')
        .select('*');

      console.log('daily_tests query result:', { dailyTests, dailyTestsError });

      if (usersError || coreTestsError || dailyTestsError) {
        console.error('Supabase query errors:', { usersError, coreTestsError, dailyTestsError });
        throw new Error('통계 데이터를 가져오는데 실패했습니다.');
      }

      const totalUsers = users?.length || 0;
      const totalCoreTests = coreTests?.length || 0;
      const totalDailyTests = dailyTests?.length || 0;
      const pendingTests = (coreTests?.filter(t => t.status === 'pending')?.length || 0) +
                          (dailyTests?.filter(t => t.status === 'pending')?.length || 0);
      const approvedTests = (coreTests?.filter(t => t.status === 'approved')?.length || 0) +
                           (dailyTests?.filter(t => t.status === 'approved')?.length || 0);
      const rejectedTests = (coreTests?.filter(t => t.status === 'rejected')?.length || 0) +
                           (dailyTests?.filter(t => t.status === 'rejected')?.length || 0);
      
      console.log('=== FILTERING USERS BY ROLE ===');
      const adminUsers = users?.filter(u => u.role === 'admin')?.length || 0;
      const regularUsers = users?.filter(u => u.role === 'user')?.length || 0;
      
      console.log('Admin users filter result:', users?.filter(u => u.role === 'admin'));
      console.log('Regular users filter result:', users?.filter(u => u.role === 'user'));
      console.log('adminUsers count:', adminUsers);
      console.log('regularUsers count:', regularUsers);

      console.log('Calculated stats:', {
        totalUsers, totalCoreTests, totalDailyTests, pendingTests,
        approvedTests, rejectedTests, adminUsers, regularUsers
      });

      console.log('=== Admin Stats Debug End ===');

      return new AdminStats({
        totalUsers,
        totalCoreTests,
        totalDailyTests,
        pendingTests,
        approvedTests,
        rejectedTests,
        activeUsers: totalUsers - (users?.filter(u => u.status === 'inactive')?.length || 0),
        inactiveUsers: users?.filter(u => u.status === 'inactive')?.length || 0,
        adminUsers,
        regularUsers
      });
    } catch (error) {
      console.error('Error getting admin stats:', error);
      throw error;
    }
  }

  // 사용자 관리 관련 메서드
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    try {
      let query = supabaseAdmin
        .from('user_profiles')
        .select('*', { count: 'exact' });

      // 필터 적용
      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.email) {
        query = query.ilike('email', `%${filters.email}%`);
      }

      // 페이지네이션
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const users = data.map(user => UserManagement.fromJson(user));
      return { users, total: count || 0 };
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async updateUserStatus(userId, newStatus) {
    try {
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async createTester(testerData) {
    try {
      // 1. 임시 비밀번호 생성 (8자리 랜덤)
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // 2. Supabase Auth에 사용자 생성 (관리자 클라이언트 사용)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: testerData.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          role: testerData.role || 'user'
        }
      });

      if (authError) throw authError;

      // 3. user_profiles 테이블에 프로필 생성
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: authData.user.id,
          email: testerData.email,
          role: testerData.role || 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) throw profileError;

      // 4. 초대 이메일 발송 (실제로는 Supabase의 이메일 템플릿 사용)
      // 여기서는 콘솔에 임시 비밀번호 출력 (실제로는 이메일 발송)
      console.log(`새 테스터 생성됨: ${testerData.email}, 임시 비밀번호: ${tempPassword}`);

      return { 
        success: true, 
        data: { 
          id: authData.user.id, 
          email: testerData.email,
          tempPassword 
        } 
      };
    } catch (error) {
      console.error('Error creating tester:', error);
      throw error;
    }
  }

  // 테스트 검토 관련 메서드
  async getPendingTests(page = 1, limit = 10) {
    try {
      // 코어 테스트와 데일리 테스트를 모두 가져와서 합치기
      const { data: coreTests, error: coreError } = await supabaseAdmin
        .from('core_tests')
        .select('*, user_profiles(email)')
        .eq('status', 'pending');

      const { data: dailyTests, error: dailyError } = await supabaseAdmin
        .from('daily_tests')
        .select('*, user_profiles(email)')
        .eq('status', 'pending');

      if (coreError || dailyError) throw coreError || dailyError;

      const allTests = [
        ...(coreTests || []).map(test => ({
          ...test,
          test_type: 'core',
          user_email: test.user_profiles?.email
        })),
        ...(dailyTests || []).map(test => ({
          ...test,
          test_type: 'daily',
          user_email: test.user_profiles?.email
        }))
      ];

      const tests = allTests.map(test => TestReview.fromJson(test));
      return { tests, total: tests.length };
    } catch (error) {
      console.error('Error getting pending tests:', error);
      throw error;
    }
  }

  async approveTest(testId, adminId, comment = '') {
    try {
      // 테스트 타입에 따라 다른 테이블 업데이트
      const { data: test, error: fetchError } = await supabaseAdmin
        .from('core_tests')
        .select('*')
        .eq('id', testId)
        .single();

      let updateError;
      if (test) {
        const { error } = await supabaseAdmin
          .from('core_tests')
          .update({
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            reviewed_by: adminId,
            review_comment: comment
          })
          .eq('id', testId);
        updateError = error;
      } else {
        const { error } = await supabaseAdmin
          .from('daily_tests')
          .update({
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            reviewed_by: adminId,
            review_comment: comment
          })
          .eq('id', testId);
        updateError = error;
      }

      if (fetchError || updateError) throw fetchError || updateError;
      return { success: true };
    } catch (error) {
      console.error('Error approving test:', error);
      throw error;
    }
  }

  async rejectTest(testId, adminId, comment = '') {
    try {
      // 테스트 타입에 따라 다른 테이블 업데이트
      const { data: test, error: fetchError } = await supabaseAdmin
        .from('core_tests')
        .select('*')
        .eq('id', testId)
        .single();

      let updateError;
      if (test) {
        const { error } = await supabaseAdmin
          .from('core_tests')
          .update({
            status: 'rejected',
            reviewed_at: new Date().toISOString(),
            reviewed_by: adminId,
            review_comment: comment
          })
          .eq('id', testId);
        updateError = error;
      } else {
        const { error } = await supabaseAdmin
          .from('daily_tests')
          .update({
            status: 'rejected',
            reviewed_at: new Date().toISOString(),
            reviewed_by: adminId,
            review_comment: comment
          })
          .eq('id', testId);
        updateError = error;
      }

      if (fetchError || updateError) throw fetchError || updateError;
      return { success: true };
    } catch (error) {
      console.error('Error rejecting test:', error);
      throw error;
    }
  }

  async getAllTests(page = 1, limit = 10, filters = {}) {
    try {
      // 필터에 따른 쿼리 구성
      let coreQuery = supabaseAdmin.from('core_tests').select('*, user_profiles(email)');
      let dailyQuery = supabaseAdmin.from('daily_tests').select('*, user_profiles(email)');

      if (filters.status) {
        coreQuery = coreQuery.eq('status', filters.status);
        dailyQuery = dailyQuery.eq('status', filters.status);
      }
      if (filters.testType === 'core') {
        dailyQuery = dailyQuery.eq('id', 'nonexistent');
      }
      if (filters.testType === 'daily') {
        coreQuery = coreQuery.eq('id', 'nonexistent');
      }

      const { data: coreTests, error: coreError } = await coreQuery;
      const { data: dailyTests, error: dailyError } = await dailyQuery;

      if (coreError || dailyError) throw coreError || dailyError;

      const allTests = [
        ...(coreTests || []).map(test => ({
          ...test,
          test_type: 'core',
          user_email: test.user_profiles?.email
        })),
        ...(dailyTests || []).map(test => ({
          ...test,
          test_type: 'daily',
          user_email: test.user_profiles?.email
        }))
      ];

      const tests = allTests.map(test => TestReview.fromJson(test));
      return { tests, total: tests.length };
    } catch (error) {
      console.error('Error getting all tests:', error);
      throw error;
    }
  }
} 