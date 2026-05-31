export interface UrgentCase {
  id: string;
  user_id: string | null;
  severity_level: "Critical" | "Urgent" | "Medium" | "Low";
  summary_ar: string;
  created_at: string;
}
