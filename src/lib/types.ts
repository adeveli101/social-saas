// =============================================================================
// Global Type Definitions
// =============================================================================

export interface SuggestionCategory {
  name: string
  suggestions: Record<string, {
    prompt: string
    style: string
    image_count: number
  }>
}

export interface UserTemplate {
  id: string
  name: string
  mainTopic: string
  audience: string
  purpose: string
  keyPoints: string[]
  category: TemplateCategory
  createdAt: Date
  updatedAt?: Date
  user_id?: string
}

export type TemplateCategory = 
  | 'Marketing'
  | 'Personal Growth'
  | 'E-commerce'
  | 'Education'
  | 'Inspiration'
  | 'Other' 