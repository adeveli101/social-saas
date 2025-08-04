import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export const createBrowserSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are not configured');
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}; 