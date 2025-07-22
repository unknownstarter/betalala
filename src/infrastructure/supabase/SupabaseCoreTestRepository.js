import { supabase } from './client.js';
import { fileUploadService } from '../services/FileUploadService.js';

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

  // 기존 메서드 (하위 호환성)
  async uploadFile(file, path) {
    return await supabase.storage
      .from('test-uploads')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
  }

  // 개선된 파일 업로드 메서드
  async uploadFileWithService(file, path) {
    return await fileUploadService.uploadFile(file, path, {
      compress: true,
      maxWidth: 1920,
      quality: 0.8
    });
  }

  // 파일 삭제
  async deleteFile(path) {
    return await fileUploadService.deleteFile(path);
  }

  // 파일 정보 조회
  async getFileInfo(path) {
    return await fileUploadService.getFileInfo(path);
  }
} 