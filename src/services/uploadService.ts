import { supabase } from "../lib/supabase";

export interface UploadProgressPayload {
  loaded: number;
  total: number;
  percentage: number;
}

export const uploadService = {
  /**
   * Validate file size and mime types securely before uploading
   */
  validateFile(file: File, allowedTypes: string[] = ["image/png", "image/jpeg", "application/pdf"], maxSizeMB = 5): void {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed formats: ${allowedTypes.join(", ")}`);
    }

    if (file.size > maxSizeBytes) {
      throw new Error(`File is too large. Maximum allowed size is ${maxSizeMB}MB.`);
    }
  },

  /**
   * Upload a file into a specific Supabase storage bucket
   */
  async uploadFile(
    bucket: "profile-images" | "medical-scans" | "xrays" | "reports",
    path: string,
    file: File,
    onProgress?: (progress: UploadProgressPayload) => void
  ): Promise<string> {
    // Validate file first
    this.validateFile(file);

    // Standard bucket upload call (with path hashing for uniqueness)
    const uniquePath = `${Date.now()}_${path.replace(/\s+/g, "_")}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniquePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;

    // Simulate progress trigger since the basic JS SDK upload doesn't have an built-in callback
    if (onProgress) {
      onProgress({ loaded: 100, total: 100, percentage: 100 });
    }

    return data.path;
  },

  /**
   * Retrieve the secure public URL for a file in a storage bucket
   */
  getPublicUrl(bucket: "profile-images" | "medical-scans" | "xrays" | "reports", path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Delete a file from a storage bucket
   */
  async deleteFile(bucket: "profile-images" | "medical-scans" | "xrays" | "reports", path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  },
};
