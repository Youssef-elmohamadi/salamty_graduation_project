export type UserRole = 'user' | 'doctor' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Hospital {
  id: string;
  name: string;
  name_ar: string;
  latitude: number;
  longitude: number;
  address?: string;
  address_ar?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export interface MedicalAnalysis {
  id: string;
  user_id: string;
  analysis_type: string;
  result_summary: string;
  doctor_notes?: string;
  status: 'pending' | 'reviewed' | 'alert';
  created_at: string;
  updated_at: string;
}

export interface XrayUpload {
  id: string;
  user_id: string;
  file_path: string;
  ai_diagnosis?: string;
  confidence_score?: number;
  status: 'uploading' | 'processed' | 'failed';
  created_at: string;
}

export interface EmergencyRequest {
  id: string;
  user_id?: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'dispatched' | 'resolved';
  assigned_hospital_id?: string;
  created_at: string;
}

export interface MessageContent {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AiConversation {
  id: string;
  user_id: string;
  title: string;
  messages: MessageContent[];
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
