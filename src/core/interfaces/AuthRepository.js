export class AuthRepository {
  async signIn(email, password) {
    throw new Error('AuthRepository.signIn must be implemented');
  }

  async signOut() {
    throw new Error('AuthRepository.signOut must be implemented');
  }

  async getCurrentUser() {
    throw new Error('AuthRepository.getCurrentUser must be implemented');
  }

  async onAuthStateChange(callback) {
    throw new Error('AuthRepository.onAuthStateChange must be implemented');
  }
} 