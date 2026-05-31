import { supabase } from "../../lib/supabase";

export interface RegisterMetadata {
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  blood_type?: string;
  allergies?: string;
  chronic_diseases?: string;
}

export const authService = {
  /**
   * Log in an existing user using email and password credentials
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Register a new user in Supabase with clinical metadata
   */
  async signUp(email: string, password: string, metadata: RegisterMetadata) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out the active session
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Trigger a password recovery reset link email
   */
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/signin`,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Retrieve current authentication session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Subscribe to real-time authentication session updates
   */
  onAuthChange(callback: (event: string, session: any) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return data.subscription;
  },
};
