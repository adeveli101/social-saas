'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getTodos, toggleTodoComplete, deleteTodo, filterTodosByStatus, filterTodosByPriority, sortTodosByPriority, sortTodosByDueDate, priorityColors, priorityLabels } from '@/lib/todo'
import { Check, Trash2, Calendar, Clock, Loader2 } from 'lucide-react'

interface TodoListProps {
  userId: string
}

export function TodoList({ userId }: TodoListProps) {
  const [todos, setTodos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [sortBy, setSortBy] = useState<'priority' | 'due_date' | 'created_at'>('created_at')

  const loadTodos = async () => {
    try {
      setLoading(true)
      const data = await getTodos(userId)
      setTodos(data)
    } catch (error) {
      console.error('Error loading todos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [userId])

  // Expose loadTodos function for parent components
  useEffect(() => {
    // This allows the parent to trigger a reload
    const handleReload = () => loadTodos()
    window.addEventListener('todo-created', handleReload)
    return () => window.removeEventListener('todo-created', handleReload)
  }, [userId])

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await toggleTodoComplete(id, completed)
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const filteredAndSortedTodos = () => {
    let filtered = todos

    // Filter by status
    if (filter === 'pending') {
      filtered = filterTodosByStatus(filtered, false)
    } else if (filter === 'completed') {
      filtered = filterTodosByStatus(filtered, true)
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filterTodosByPriority(filtered, priorityFilter)
    }

    // Sort
    if (sortBy === 'priority') {
      filtered = sortTodosByPriority(filtered)
    } else if (sortBy === 'due_date') {
      filtered = sortTodosByDueDate(filtered)
    }

    return filtered
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <Card className="bg-background border-border">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  const filteredTodos = filteredAndSortedTodos()

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="heading-gradient heading">Your Todos</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
              <SelectTrigger className="w-32 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as any)}>
              <SelectTrigger className="w-32 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-32 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="due_date">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No todos found. Create your first todo!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                  todo.completed 
                    ? 'bg-muted/50 opacity-75' 
                    : 'bg-background border-border'
                }`}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={(checked) => handleToggleComplete(todo.id, checked as boolean)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : 'heading-gradient heading'}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${priorityColors[todo.priority as keyof typeof priorityColors]}`}
                        >
                          {priorityLabels[todo.priority as keyof typeof priorityLabels]}
                        </Badge>
                        {todo.due_date && (
                          <div className={`flex items-center gap-1 text-xs ${
                            isOverdue(todo.due_date) && !todo.completed
                              ? 'text-red-500'
                              : 'text-muted-foreground'
                          }`}>
                            <Calendar className="h-3 w-3" />
                            {formatDate(todo.due_date)}
                            {isOverdue(todo.due_date) && !todo.completed && (
                              <span className="text-red-500">(Overdue)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(todo.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}