import { supabase } from "../lib/supabase";
import { Hospital } from "../types/database.types";

export const hospitalService = {
  /**
   * Fetch all active medical care providers/clinics/hospitals
   */
  async getHospitals(): Promise<Hospital[]> {
    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) throw error;
    
    // Seed default mock hospitals if table is empty to keep user experience smooth
    if (!data || data.length === 0) {
      return [
        {
          id: "h1",
          name: "Salamati AI Trauma Center",
          name_ar: "مركز سلامتي للذكاء الاصطناعي للحالات الحرجة",
          latitude: 24.7136,
          longitude: 46.6753,
          address: "King Fahd Rd, Riyadh",
          address_ar: "طريق الملك فهد، الرياض",
          phone: "+966 11 456 7890",
          is_active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "h2",
          name: "King Faisal Specialist Hospital",
          name_ar: "مستشفى الملك فيصل التخصصي",
          latitude: 24.6710,
          longitude: 46.6791,
          address: "Zahrawi St, Riyadh",
          address_ar: "شارع الزهراوي، الرياض",
          phone: "+966 11 920 0123",
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ];
    }
    
    return data;
  },

  /**
   * Insert a new provider (Admin function)
   */
  async createHospital(hospital: Omit<Hospital, "id" | "created_at">): Promise<Hospital> {
    const { data, error } = await supabase
      .from("hospitals")
      .insert(hospital)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
