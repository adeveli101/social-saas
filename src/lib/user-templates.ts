import { createBrowserSupabaseClient } from '@/utils/supabase/client'
import { UserTemplate } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export const getUserTemplates = async (userId: string) => {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('user_templates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error('Failed to fetch templates')
  
  // Convert database response to UserTemplate format
  return data.map(item => ({
    id: item.id,
    name: item.name,
    mainTopic: item.main_topic,
    audience: item.audience,
    purpose: item.purpose,
    keyPoints: typeof item.key_points === 'string' ? JSON.parse(item.key_points) : item.key_points,
    category: item.category,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
    user_id: item.user_id
  }))
}

export const getUserTemplate = async (templateId: string) => {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('user_templates')
    .select('*')
    .eq('id', templateId)
    .single()
  if (error) throw new Error('Failed to fetch template')
  
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
    user_id: data.user_id
  }
}

export const saveUserTemplate = async (template: Omit<UserTemplate, 'id' | 'createdAt' | 'updatedAt'>, userId: string) => {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('user_templates')
    .insert({
      user_id: userId,
      name: template.name,
      main_topic: template.mainTopic,
      audience: template.audience,
      purpose: template.purpose,
      key_points: template.keyPoints,
      category: template.category
    })
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

export function createUserTemplateLocal(template: Omit<UserTemplate, 'id' | 'createdAt' | 'updatedAt'>): UserTemplate {
  const newTemplate: UserTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
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