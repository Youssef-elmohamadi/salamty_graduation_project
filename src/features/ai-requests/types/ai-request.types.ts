export interface AiRequest {
  id: string | number;
  user_email: string;
  user_name?: string;
  request_type: "medical_analysis" | "xray_analysis" | "symptom_checker" | "emergency_assistance" | "first_aid" | "ai_medical_chat";
  request_message: string;
  ai_response: string;
  status: "pending" | "processing" | "completed" | "failed";
  response_time: number; // in seconds
  created_at: string;
  metadata?: {
    model_used?: string;
    tokens_consumed?: number;
    clinical_flags?: string[];
    attached_files?: string[];
  };
}
