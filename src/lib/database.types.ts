export type ContentTask = {
  id: string
  user_id: string
  title: string
  status: 'idea' | 'in_progress' | 'to_review' | 'ready_to_post' | 'posted'
  planned_date: string | null
  category: string[] | null
  priority: 'low' | 'medium' | 'high'
  notes: string | null
  carousel_id: string | null
  created_at: string
  updated_at: string
} 