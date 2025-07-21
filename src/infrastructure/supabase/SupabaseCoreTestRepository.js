import { supabase } from './client.js';

export class SupabaseCoreTestRepository {
  async getCoreTestsByUserId(userId) {
    return await supabase
      .from('core_tests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  }

  async createCoreTest(coreTestData) {
    return await supabase
      .from('core_tests')
      .insert([coreTestData])
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