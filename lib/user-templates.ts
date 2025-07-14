import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types'

// Helper to create a client
const createClient = () => createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getUserTemplates(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_templates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user templates:', error)
    throw new Error(error.message)
  }
  return data
}

export async function deleteUserTemplate(templateId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('user_templates')
    .delete()
    .eq('id', templateId)
  
  if (error) {
    console.error('Error deleting user template:', error)
    throw new Error(error.message)
  }
}

export async function updateUserTemplate(templateId: string, updates: Partial<{ usageCount: number }>) {
  const supabase = createClient()
  const { error } = await supabase
    .from('user_templates')
    .update(updates)
    .eq('id', templateId)

  if (error) {
    console.error('Error updating user template:', error)
    throw new Error(error.message)
  }
} 