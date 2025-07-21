import { supabase } from './client.js';

export class SupabaseDailyTestRepository {
  async getDailyTestsByUserId(userId) {
    return await supabase
      .from('daily_tests')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
  }

  async getDailyTestByDate(userId, date) {
    return await supabase
      .from('daily_tests')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date);
  }

  async createDailyTest(dailyTestData) {
    return await supabase
      .from('daily_tests')
      .insert([dailyTestData])
      .select();
  }

  async uploadFile(file, path) {
    return await supabase.storage
      .from('test-uploads')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
  }
} 