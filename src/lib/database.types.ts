export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ContentTask type for content board
export interface ContentTask {
  id: string
  user_id: string
  title: string
  description: string | null
  notes: string | null
  status: 'idea' | 'in_progress' | 'to_review' | 'ready_to_post' | 'posted'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  planned_date: string | null
  category: string[]
  carousel_id: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
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
        Relationships: [
          {
            foreignKeyName: "carousel_slides_carousel_id_fkey"
            columns: ["carousel_id"]
            isOneToOne: false
            referencedRelation: "carousels"
            referencedColumns: ["id"]
          }
        ]
      }
      carousels: {
        Row: {
          id: string
          user_id: string
          clerk_user_id: string | null
          prompt: string
          image_count: number
          status: string
          final_caption: string | null
          error_message: string | null
          progress_percent: number | null
          progress_message: string | null
          generation_metadata: Json | null
          estimated_completion_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clerk_user_id?: string | null
          prompt: string
          image_count: number
          status?: string
          final_caption?: string | null
          error_message?: string | null
          progress_percent?: number | null
          progress_message?: string | null
          generation_metadata?: Json | null
          estimated_completion_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clerk_user_id?: string | null
          prompt?: string
          image_count?: number
          status?: string
          final_caption?: string | null
          error_message?: string | null
          progress_percent?: number | null
          progress_message?: string | null
          generation_metadata?: Json | null
          estimated_completion_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      generation_jobs: {
        Row: {
          id: string
          carousel_id: string
          user_id: string
          clerk_user_id: string | null
          job_type: string
          status: string
          priority: number
          payload: Json
          result: Json | null
          error_message: string | null
          retry_count: number
          max_retries: number
          scheduled_at: string
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          carousel_id: string
          user_id: string
          clerk_user_id?: string | null
          job_type?: string
          status?: string
          priority?: number
          payload: Json
          result?: Json | null
          error_message?: string | null
          retry_count?: number
          max_retries?: number
          scheduled_at?: string
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          carousel_id?: string
          user_id?: string
          clerk_user_id?: string | null
          job_type?: string
          status?: string
          priority?: number
          payload?: Json
          result?: Json | null
          error_message?: string | null
          retry_count?: number
          max_retries?: number
          scheduled_at?: string
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_jobs_carousel_id_fkey"
            columns: ["carousel_id"]
            isOneToOne: false
            referencedRelation: "carousels"
            referencedColumns: ["id"]
          }
        ]
      }
      todos: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          completed: boolean
          priority: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          notes: string | null
          status: string
          priority: string
          due_date: string | null
          planned_date: string | null
          category: string[]
          carousel_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          notes?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          planned_date?: string | null
          category?: string[]
          carousel_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          notes?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          planned_date?: string | null
          category?: string[]
          carousel_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          main_topic: string
          audience: string
          purpose: string
          key_points: string[]
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          main_topic: string
          audience: string
          purpose: string
          key_points: string[]
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          main_topic?: string
          audience?: string
          purpose?: string
          key_points?: string[]
          category?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          clerk_id: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          plan: string
          credits: number
          daily_limit: number
          last_reset_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          plan?: string
          credits?: number
          daily_limit?: number
          last_reset_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          plan?: string
          credits?: number
          daily_limit?: number
          last_reset_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 