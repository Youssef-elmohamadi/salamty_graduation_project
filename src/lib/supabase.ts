import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://emdrsbvdwazingirktby.supabase.co";
// Retrieve key from import.meta.env
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Valid-looking dummy JWT token to prevent client-side startup crashes (supabaseKey is required)
const fallbackKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE2OTAxNjAwLCJleHAiOjIwMzI0Nzc2MDB9.salamati-local-placeholder-key";

// If the key is the literal placeholder string or empty, safely fall back to the process environment or fallback JWT
if (!supabaseAnonKey || supabaseAnonKey === "process.env.VITE_SUPABASE_ANON_KEY") {
  supabaseAnonKey =
    ((globalThis as any).process?.env?.VITE_SUPABASE_ANON_KEY) ||
    fallbackKey;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


