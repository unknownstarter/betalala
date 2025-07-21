import { supabase } from './SupabaseClient.js';
import { User } from '../../core/entities/User.js';

export class SupabaseUserRepository {
  async getUserById(userId) {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      // user_profile 테이블에서 role 정보 가져오기
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // auth user 정보와 profile 정보를 결합
      const userData = {
        id: authUser.user.id,
        email: authUser.user.email,
        role: profile?.role || 'user'
      };

      return User.fromJson(userData);
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('사용자 정보를 가져오는데 실패했습니다.');
    }
  }

  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: userData.id,
          email: userData.email,
          role: userData.role || 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return User.fromJson({ ...userData, role: data.role });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('사용자 생성에 실패했습니다.');
    }
  }

  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return User.fromJson({ id: userId, ...data });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('사용자 정보 업데이트에 실패했습니다.');
    }
  }

  async deleteUser(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('사용자 삭제에 실패했습니다.');
    }
  }
} 