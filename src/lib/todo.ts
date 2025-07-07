import { typedSupabase } from './supabase'
import type { Database } from './supabase'

type Todo = Database['public']['Tables']['todos']['Row']
type TodoInsert = Database['public']['Tables']['todos']['Insert']
type TodoUpdate = Database['public']['Tables']['todos']['Update']

// Todo CRUD operations
export async function getTodos(userId: string): Promise<Todo[]> {
  const { data, error } = await typedSupabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching todos:', error)
    throw new Error('Failed to fetch todos')
  }

  return data || []
}

export async function createTodo(todo: TodoInsert): Promise<Todo> {
  const { data, error } = await typedSupabase
    .from('todos')
    .insert(todo)
    .select()
    .single()

  if (error) {
    console.error('Error creating todo:', error)
    throw new Error('Failed to create todo')
  }

  return data
}

export async function updateTodo(id: string, updates: TodoUpdate): Promise<Todo> {
  const { data, error } = await typedSupabase
    .from('todos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating todo:', error)
    throw new Error('Failed to update todo')
  }

  return data
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await typedSupabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting todo:', error)
    throw new Error('Failed to delete todo')
  }
}

export async function toggleTodoComplete(id: string, completed: boolean): Promise<Todo> {
  return updateTodo(id, { completed })
}

// Todo filtering and sorting
export function filterTodosByStatus(todos: Todo[], completed?: boolean): Todo[] {
  if (completed === undefined) return todos
  return todos.filter(todo => todo.completed === completed)
}

export function filterTodosByPriority(todos: Todo[], priority?: 'low' | 'medium' | 'high'): Todo[] {
  if (!priority) return todos
  return todos.filter(todo => todo.priority === priority)
}

export function sortTodosByPriority(todos: Todo[]): Todo[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  return todos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
}

export function sortTodosByDueDate(todos: Todo[]): Todo[] {
  return todos.sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0
    if (!a.due_date) return 1
    if (!b.due_date) return -1
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  })
}

// Todo statistics
export function getTodoStats(todos: Todo[]) {
  const total = todos.length
  const completed = todos.filter(todo => todo.completed).length
  const pending = total - completed
  const highPriority = todos.filter(todo => todo.priority === 'high' && !todo.completed).length

  return {
    total,
    completed,
    pending,
    highPriority,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}

// Todo validation
export function validateTodo(todo: Partial<TodoInsert>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!todo.title?.trim()) {
    errors.push('Title is required')
  }

  if (todo.title && todo.title.length > 100) {
    errors.push('Title must be less than 100 characters')
  }

  if (todo.description && todo.description.length > 500) {
    errors.push('Description must be less than 500 characters')
  }

  if (todo.due_date) {
    const dueDate = new Date(todo.due_date)
    if (isNaN(dueDate.getTime())) {
      errors.push('Invalid due date')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Priority colors for UI
export const priorityColors = {
  low: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
  medium: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
  high: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
} as const

// Priority labels
export const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
} as const 