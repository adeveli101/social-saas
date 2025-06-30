import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      carousels: {
        Row: {
          id: string
          user_id: string
          prompt: string
          image_count: number
          status: 'pending' | 'processing' | 'completed' | 'failed'
          final_caption: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          image_count: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          final_caption?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          image_count?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          final_caption?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      carousel_slides: {
        Row: {
          id: string
          carousel_id: string
          slide_number: number
          image_url: string | null
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          carousel_id: string
          slide_number: number
          image_url?: string | null
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          carousel_id?: string
          slide_number?: number
          image_url?: string | null
          caption?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Typed Supabase client
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 