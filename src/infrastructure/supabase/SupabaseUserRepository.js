import { supabase } from './client.js';
import { User } from '../../core/entities/User.js';

export class SupabaseUserRepository {
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return { data: null, error };
    return { data: User.fromJson(data), error: null };
  }

  async updateUserProfile(userId, profileData) {
    return await supabase
      .from('user_profiles')
      .update(profileData)
      .eq('user_id', userId)
      .select();
  }

  async createUserProfile(userId, profileData) {
    const profileWithUserId = {
      ...profileData,
      user_id: userId
    };

    return await supabase
      .from('user_profiles')
      .insert([profileWithUserId])
      .select();
  }
} 