import { createBrowserSupabaseClient } from '@/utils/supabase/client'
import type { ContentTask } from './database.types'

const supabase = createBrowserSupabaseClient()

// Tüm görevleri getir
export async function getContentTasks(userId: string): Promise<ContentTask[]> {
  const { data, error } = await supabase
    .from('content_tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to fetch content tasks')
  return data || []
}

// Yeni görev oluştur
export async function createContentTask(task: Omit<ContentTask, 'id' | 'created_at' | 'updated_at'>): Promise<ContentTask> {
  const { data, error } = await supabase
    .from('content_tasks')
    .insert(task)
    .select()
    .single()

  if (error) throw new Error('Failed to create content task')
  return data
}

// Görev güncelle
export async function updateContentTask(id: string, updates: Partial<ContentTask>): Promise<ContentTask> {
  const { data, error } = await supabase
    .from('content_tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error('Failed to update content task')
  return data
}

// Görev durumunu değiştir (move)
export async function moveContentTask(id: string, newStatus: ContentTask['status']): Promise<ContentTask> {
  return updateContentTask(id, { status: newStatus })
}

// Görev sil
export async function deleteContentTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('content_tasks')
    .delete()
    .eq('id', id)
  if (error) throw new Error('Failed to delete content task')
} 