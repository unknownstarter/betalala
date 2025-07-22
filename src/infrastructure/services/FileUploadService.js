import { supabase } from '../supabase/client.js';
import { validateFile, compressImage, generateSafeFileName } from '../../shared/utils/fileUtils.js';

export class FileUploadService {
  constructor() {
    this.bucketName = 'test-uploads';
  }

  /**
   * 파일 업로드 (압축 포함)
   * @param {File} file - 업로드할 파일
   * @param {string} path - 저장 경로
   * @param {Object} options - 옵션
   * @returns {Promise<Object>} 업로드 결과
   */
  async uploadFile(file, path, options = {}) {
    try {
      console.log('🚀 파일 업로드 시작:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        path: path
      });

      // 파일 검증
      const validation = validateFile(file);
      if (!validation.isValid) {
        console.error('❌ 파일 검증 실패:', validation.error);
        return { success: false, error: validation.error };
      }

      // 이미지 압축 (옵션)
      let fileToUpload = file;
      if (options.compress && file.type.startsWith('image/')) {
        try {
          console.log('📦 이미지 압축 시작...');
          fileToUpload = await compressImage(
            file, 
            options.maxWidth || 1920, 
            options.quality || 0.8
          );
          console.log('✅ 이미지 압축 완료:', {
            originalSize: file.size,
            compressedSize: fileToUpload.size
          });
        } catch (error) {
          console.warn('⚠️ 이미지 압축 실패, 원본 파일 사용:', error);
        }
      }

      // 안전한 파일명 생성
      const safeFileName = generateSafeFileName(fileToUpload.name, options.prefix || '');
      const fullPath = `${path}/${safeFileName}`;
      
      console.log('📝 파일 경로 생성:', {
        originalName: fileToUpload.name,
        safeFileName: safeFileName,
        fullPath: fullPath
      });

      // Supabase Storage 업로드
      console.log('☁️ Supabase Storage 업로드 시작...');
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fullPath, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
          contentType: fileToUpload.type
        });

      if (error) {
        console.error('❌ Storage upload error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          statusCode: error.statusCode,
          error: error.error
        });
        return { success: false, error: `파일 업로드에 실패했습니다: ${error.message}` };
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fullPath);

      console.log('✅ 파일 업로드 성공:', {
        path: fullPath,
        url: urlData.publicUrl,
        size: fileToUpload.size
      });

      return {
        success: true,
        data: {
          path: fullPath,
          url: urlData.publicUrl,
          size: fileToUpload.size,
          type: fileToUpload.type,
          name: fileToUpload.name
        }
      };

    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, error: '파일 업로드 중 오류가 발생했습니다.' };
    }
  }

  /**
   * 여러 파일 동시 업로드
   * @param {Array} files - 파일 배열
   * @param {string} basePath - 기본 경로
   * @param {Object} options - 옵션
   * @returns {Promise<Array>} 업로드 결과 배열
   */
  async uploadMultipleFiles(files, basePath, options = {}) {
    const uploadPromises = files.map((file, index) => {
      const filePath = `${basePath}/file_${index + 1}`;
      return this.uploadFile(file, filePath, options);
    });

    return await Promise.all(uploadPromises);
  }

  /**
   * 파일 삭제
   * @param {string} path - 삭제할 파일 경로
   * @returns {Promise<Object>} 삭제 결과
   */
  async deleteFile(path) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([path]);

      if (error) {
        console.error('File deletion error:', error);
        return { success: false, error: '파일 삭제에 실패했습니다.' };
      }

      return { success: true };
    } catch (error) {
      console.error('File deletion error:', error);
      return { success: false, error: '파일 삭제 중 오류가 발생했습니다.' };
    }
  }

  /**
   * 파일 정보 조회
   * @param {string} path - 파일 경로
   * @returns {Promise<Object>} 파일 정보
   */
  async getFileInfo(path) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(path.split('/').slice(0, -1).join('/'));

      if (error) {
        console.error('File info error:', error);
        return { success: false, error: '파일 정보 조회에 실패했습니다.' };
      }

      const fileName = path.split('/').pop();
      const fileInfo = data.find(file => file.name === fileName);

      if (!fileInfo) {
        return { success: false, error: '파일을 찾을 수 없습니다.' };
      }

      return { success: true, data: fileInfo };
    } catch (error) {
      console.error('File info error:', error);
      return { success: false, error: '파일 정보 조회 중 오류가 발생했습니다.' };
    }
  }

  /**
   * 파일 다운로드 URL 생성
   * @param {string} path - 파일 경로
   * @returns {string} 다운로드 URL
   */
  getDownloadUrl(path) {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}

// 싱글톤 인스턴스
export const fileUploadService = new FileUploadService(); 