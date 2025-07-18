import { createBrowserSupabaseClient } from '@/utils/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import type { UserTemplate } from './carousel-suggestions'

export const getUserTemplates = async (userId: string) => {
  const supabase = createBrowserSupabaseClient()
  try {
    console.log('Fetching templates for user:', userId)
    
    const { data, error } = await supabase
      .from('user_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    console.log('Supabase response:', { data, error })
    
    if (error) {
      console.error('Supabase error details:', error)
      throw new Error(`Failed to fetch user templates: ${error.message}`)
    }
    
    // Convert database response to UserTemplate format
    return (data || []).map(template => ({
      id: template.id,
      name: template.name,
      mainTopic: template.main_topic,
      audience: template.audience,
      purpose: template.purpose,
      keyPoints: typeof template.key_points === 'string' ? JSON.parse(template.key_points) : template.key_points,
      category: template.category,
      createdAt: new Date(template.created_at),
      updatedAt: new Date(template.updated_at),
      usageCount: template.usage_count,
      user_id: template.user_id
    }))
  } catch (error) {
    console.error('Error in getUserTemplates:', error)
    // Return empty array as fallback instead of throwing
    return []
  }
}

export const saveUserTemplate = async (template: Omit<UserTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>, userId: string) => {
  const supabase = createBrowserSupabaseClient()
  const newTemplate = {
    name: template.name,
    main_topic: template.mainTopic,
    audience: template.audience,
    purpose: template.purpose,
    key_points: JSON.stringify(template.keyPoints),
    category: template.category,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    usage_count: 0
  }
  const { data, error } = await supabase
    .from('user_templates')
    .insert([newTemplate])
    .select()
    .single()
  if (error) throw new Error('Failed to create template')
  
  // Convert database response to UserTemplate format
  return {
    id: data.id,
    name: data.name,
    mainTopic: data.main_topic,
    audience: data.audience,
    purpose: data.purpose,
    keyPoints: typeof data.key_points === 'string' ? JSON.parse(data.key_points) : data.key_points,
    category: data.category,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    usageCount: data.usage_count,
    user_id: data.user_id
  }
}

export const updateUserTemplate = async (templateId: string, updates: Partial<UserTemplate>) => {
  const supabase = createBrowserSupabaseClient()
  // Convert UserTemplate format to database format
  const dbUpdates: any = { updated_at: new Date().toISOString() }
  if (updates.name) dbUpdates.name = updates.name
  if (updates.mainTopic) dbUpdates.main_topic = updates.mainTopic
  if (updates.audience) dbUpdates.audience = updates.audience
  if (updates.purpose) dbUpdates.purpose = updates.purpose
  if (updates.keyPoints) dbUpdates.key_points = JSON.stringify(updates.keyPoints)
  if (updates.category) dbUpdates.category = updates.category
  if (updates.usageCount !== undefined) dbUpdates.usage_count = updates.usageCount
  
  const { data, error } = await supabase
    .from('user_templates')
    .update(dbUpdates)
    .eq('id', templateId)
    .select()
    .single()
  if (error) throw new Error('Failed to update template')
  
  // Convert database response to UserTemplate format
  return {
    id: data.id,
    name: data.name,
    mainTopic: data.main_topic,
    audience: data.audience,
    purpose: data.purpose,
    keyPoints: typeof data.key_points === 'string' ? JSON.parse(data.key_points) : data.key_points,
    category: data.category,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    usageCount: data.usage_count,
    user_id: data.user_id
  }
}

export const deleteUserTemplate = async (templateId: string) => {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase
    .from('user_templates')
    .delete()
    .eq('id', templateId)
  if (error) throw new Error('Failed to delete template')
}

// --- localStorage Fallback (for demo/test only) ---

const LS_KEY = 'userTemplates'

export function getUserTemplatesLocal(): UserTemplate[] {
  return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
}

export function createUserTemplateLocal(template: Omit<UserTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): UserTemplate {
  const newTemplate: UserTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    usageCount: 0
  }
  const templates = getUserTemplatesLocal()
  templates.push(newTemplate)
  localStorage.setItem(LS_KEY, JSON.stringify(templates))
  return newTemplate
}

export function updateUserTemplateLocal(templateId: string, updates: Partial<UserTemplate>): UserTemplate | null {
  const templates = getUserTemplatesLocal()
  const idx = templates.findIndex(t => t.id === templateId)
  if (idx === -1) return null
  templates[idx] = { ...templates[idx], ...updates, updatedAt: new Date() }
  localStorage.setItem(LS_KEY, JSON.stringify(templates))
  return templates[idx]
}

export function deleteUserTemplateLocal(templateId: string): void {
  const templates = getUserTemplatesLocal().filter(t => t.id !== templateId)
  localStorage.setItem(LS_KEY, JSON.stringify(templates))
} 