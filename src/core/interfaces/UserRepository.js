import { User } from '../entities/User.js';

export class UserRepository {
  async getUserProfile(userId) {
    throw new Error('UserRepository.getUserProfile must be implemented');
  }

  async updateUserProfile(userId, profileData) {
    throw new Error('UserRepository.updateUserProfile must be implemented');
  }

  async createUserProfile(userId, profileData) {
    throw new Error('UserRepository.createUserProfile must be implemented');
  }
} 