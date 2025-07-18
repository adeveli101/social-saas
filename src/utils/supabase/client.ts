import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export const createBrowserSupabaseClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ); 