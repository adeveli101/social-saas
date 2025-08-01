import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types'

// Helper to create a client
const createClient = () => createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getUserTemplates(userId: string) {
  // Temporarily disabled - user_templates table not in schema
  console.log('getUserTemplates called but table not available')
  return []
}

export async function deleteUserTemplate(templateId: string) {
  // Temporarily disabled - user_templates table not in schema
  console.log('deleteUserTemplate called but table not available')
}

export async function updateUserTemplate(templateId: string, updates: Partial<{ usageCount: number }>) {
  // Temporarily disabled - user_templates table not in schema
  console.log('updateUserTemplate called but table not available')
}

export async function createUserTemplate(template: any, userId: string) {
  // Temporarily disabled - user_templates table not in schema
  console.log('createUserTemplate called but table not available')
  return { id: 'temp-id', ...template }
} 