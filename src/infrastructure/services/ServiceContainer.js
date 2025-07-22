import { SupabaseAuthRepository } from '../supabase/SupabaseAuthRepository.js';
import { SupabaseUserRepository } from '../supabase/UserRepository.js';
import { SupabaseCoreTestRepository } from '../supabase/SupabaseCoreTestRepository.js';
import { SupabaseDailyTestRepository } from '../supabase/SupabaseDailyTestRepository.js';
import { SupabaseAdminRepository } from '../supabase/AdminRepository.js';
import { AuthUseCase } from '../../core/usecases/AuthUseCase.js';
import { CoreTestUseCase } from '../../core/usecases/CoreTestUseCase.js';
import { DailyTestUseCase } from '../../core/usecases/DailyTestUseCase.js';
import { AdminUseCase } from '../../core/usecases/AdminUseCase.js';
import { FileUploadService } from './FileUploadService.js';
import { EdgeFunctionService } from './EdgeFunctionService.js';

class ServiceContainer {
  constructor() {
    this._authRepository = null;
    this._userRepository = null;
    this._coreTestRepository = null;
    this._dailyTestRepository = null;
    this._adminRepository = null;
    this._authUseCase = null;
    this._coreTestUseCase = null;
    this._dailyTestUseCase = null;
    this._adminUseCase = null;
    this._fileUploadService = null;
    this._edgeFunctionService = null;
  }

  // Repositories
  getAuthRepository() {
    if (!this._authRepository) {
      this._authRepository = new SupabaseAuthRepository();
    }
    return this._authRepository;
  }

  getUserRepository() {
    if (!this._userRepository) {
      this._userRepository = new SupabaseUserRepository();
    }
    return this._userRepository;
  }

  getCoreTestRepository() {
    if (!this._coreTestRepository) {
      this._coreTestRepository = new SupabaseCoreTestRepository();
    }
    return this._coreTestRepository;
  }

  getDailyTestRepository() {
    if (!this._dailyTestRepository) {
      this._dailyTestRepository = new SupabaseDailyTestRepository();
    }
    return this._dailyTestRepository;
  }

  getAdminRepository() {
    if (!this._adminRepository) {
      this._adminRepository = new SupabaseAdminRepository();
    }
    return this._adminRepository;
  }

  // Use Cases
  getAuthUseCase() {
    if (!this._authUseCase) {
      this._authUseCase = new AuthUseCase(this.getAuthRepository());
    }
    return this._authUseCase;
  }



  getCoreTestUseCase() {
    if (!this._coreTestUseCase) {
      this._coreTestUseCase = new CoreTestUseCase(this.getCoreTestRepository());
    }
    return this._coreTestUseCase;
  }

  getDailyTestUseCase() {
    if (!this._dailyTestUseCase) {
      this._dailyTestUseCase = new DailyTestUseCase(this.getDailyTestRepository());
    }
    return this._dailyTestUseCase;
  }

  getAdminUseCase() {
    if (!this._adminUseCase) {
      this._adminUseCase = new AdminUseCase(this.getAdminRepository());
    }
    return this._adminUseCase;
  }

  // File Upload Service
  getFileUploadService() {
    if (!this._fileUploadService) {
      this._fileUploadService = new FileUploadService();
    }
    return this._fileUploadService;
  }

  // Edge Function Service
  getEdgeFunctionService() {
    if (!this._edgeFunctionService) {
      this._edgeFunctionService = new EdgeFunctionService();
    }
    return this._edgeFunctionService;
  }
}

export const serviceContainer = new ServiceContainer(); 