import { supabase } from './client.js';

export class SupabaseAuthRepository {
  async signIn(email, password) {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  async getCurrentUser() {
    return await supabase.auth.getUser();
  }

  onAuthStateChange(callback) {
    try {
      return supabase.auth.onAuthStateChange(callback);
    } catch (error) {
      console.error('Auth state change error:', error);
      return { data: { subscription: null } };
    }
  }
} 