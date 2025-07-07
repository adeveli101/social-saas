'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createTodo } from '@/lib/todo'
import { priorityLabels } from '@/lib/todo'
import { Plus, Loader2 } from 'lucide-react'

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().optional(),
})

type TodoFormData = z.infer<typeof todoSchema>

interface TodoFormProps {
  userId: string
  onTodoCreated?: () => void
}

export function TodoForm({ userId, onTodoCreated }: TodoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      priority: 'medium',
    },
  })

  const onSubmit = async (data: TodoFormData) => {
    try {
      setIsSubmitting(true)
      
      await createTodo({
        user_id: userId,
        title: data.title,
        description: data.description || null,
        priority: data.priority,
        due_date: data.due_date || null,
        completed: false,
      })

      reset()
      onTodoCreated?.()
      // Trigger reload of todo list
      window.dispatchEvent(new Event('todo-created'))
    } catch (error) {
      console.error('Error creating todo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-6 bg-background border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Plus className="h-5 w-5 text-primary" />
          Add New Todo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter todo title..."
              className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter todo description..."
              rows={3}
              className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-foreground">Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{priorityLabels.low}</SelectItem>
                  <SelectItem value="medium">{priorityLabels.medium}</SelectItem>
                  <SelectItem value="high">{priorityLabels.high}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-foreground">Due Date</Label>
              <Input
                id="due_date"
                type="datetime-local"
                {...register('due_date')}
                className={`bg-background border-border text-foreground ${
                  errors.due_date ? 'border-red-500' : ''
                }`}
              />
              {errors.due_date && (
                <p className="text-sm text-red-500">{errors.due_date.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              variant="default"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Todo
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 