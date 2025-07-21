export class AuthUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async signIn(email, password) {
    try {
      const { data, error } = await this.authRepository.signIn(email, password);
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await this.authRepository.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.authRepository.getCurrentUser();
      if (error) throw error;
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
} 