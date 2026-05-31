import { supabase } from "../lib/supabase";
import { Profile } from "../types/database.types";

export const userService = {
  /**
   * Fetch a user profile by UUID from the profiles table
   */
  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update profile fields (e.g. name, phone, avatar) for a specific user ID
   */
  async updateProfile(userId: string, updates: Partial<Omit<Profile, "id" | "email" | "created_at">>): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch all profiles (useful for Admin Dashboard user management)
   */
  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
