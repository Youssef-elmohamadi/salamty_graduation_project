import { supabase } from "../lib/supabase";
import { MedicalAnalysis, XrayUpload, EmergencyRequest } from "../types/database.types";

export const analysisService = {
  // ========================================================
  // 1. MEDICAL ANALYSES LOGS
  // ========================================================

  /**
   * Save a new diagnosis or lab report summary
   */
  async createAnalysis(analysis: Omit<MedicalAnalysis, "id" | "created_at" | "updated_at">): Promise<MedicalAnalysis> {
    const { data, error } = await supabase
      .from("medical_analyses")
      .insert(analysis)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch all medical analyses logged by or for a specific user ID
   */
  async getAnalyses(userId: string): Promise<MedicalAnalysis[]> {
    const { data, error } = await supabase
      .from("medical_analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch all analyses in the system (useful for Admin Dashboard / Doctor triage)
   */
  async getAllAnalyses(): Promise<MedicalAnalysis[]> {
    const { data, error } = await supabase
      .from("medical_analyses")
      .select("*, profiles!inner(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ========================================================
  // 2. XRAY AI UPLOADS
  // ========================================================

  /**
   * Log a new X-ray scan with its computed AI diagnosis and accuracy rating
   */
  async createXrayUpload(xray: Omit<XrayUpload, "id" | "created_at">): Promise<XrayUpload> {
    const { data, error } = await supabase
      .from("xray_uploads")
      .insert(xray)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * List all historical X-rays scanned by a user
   */
  async getXrayUploads(userId: string): Promise<XrayUpload[]> {
    const { data, error } = await supabase
      .from("xray_uploads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ========================================================
  // 3. EMERGENCY PANIC SYSTEM
  // ========================================================

  /**
   * Submit an active panic alarm with geo-coordinates to the dispatcher
   */
  async submitEmergencyRequest(latitude: number, longitude: number, userId?: string): Promise<EmergencyRequest> {
    const requestData: Partial<EmergencyRequest> = {
      latitude,
      longitude,
      status: "active",
    };

    if (userId) {
      requestData.user_id = userId;
    }

    const { data, error } = await supabase
      .from("emergency_requests")
      .insert(requestData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch all active/resolved emergency alarms (Doctor/Admin view)
   */
  async getEmergencyRequests(): Promise<EmergencyRequest[]> {
    const { data, error } = await supabase
      .from("emergency_requests")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Update emergency request dispatch status or hospital allocations
   */
  async updateEmergencyStatus(
    requestId: string,
    status: "active" | "dispatched" | "resolved",
    assignedHospitalId?: string
  ): Promise<EmergencyRequest> {
    const updates: Partial<EmergencyRequest> = { status };
    if (assignedHospitalId) {
      updates.assigned_hospital_id = assignedHospitalId;
    }

    const { data, error } = await supabase
      .from("emergency_requests")
      .update(updates)
      .eq("id", requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
